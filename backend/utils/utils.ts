const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

import type {
  GPRecipeIngredientTypes,
  GPIngredientDataTypes,
} from "../../frontend/src/utils/types";
import { unitConversions } from "./constants";
import convert from "convert-units";
import { searchWalmart } from "./walmartAPI";

const checkUserExists = async (firebaseId: string) => {
  const user = await prisma.User.findUnique({
    where: { firebaseId: firebaseId },
  });
  return user;
};

type GPConvertUnitsType = {
  convertTo: GPRecipeIngredientTypes;
  converting: GPRecipeIngredientTypes;
};
const convertUnits = ({ convertTo, converting }: GPConvertUnitsType) => {
  let convertToUnit = unitConversions[convertTo.unit.toLowerCase()];
  let convertingUnit = unitConversions[converting.unit.toLowerCase()];
  let convertingQuantity = parseInt(converting.quantity);
  if (convertToUnit && convertingUnit) {
    // ingredient units converted to convert-unit library compatible format
    try {
      convertingQuantity = convert(convertingQuantity)
        .from(convertingUnit)
        .to(convertToUnit);
      convertingUnit = convertToUnit;
    } catch (error) {
      // TODO handle errors in type conversion better
      convertingQuantity = parseInt(converting.quantity);
      convertingUnit = convertingUnit;
    }
  }
  const converted = {
    convertTo: { quantity: convertTo.quantity, unit: convertToUnit },
    converted: { quantity: convertingQuantity, unit: convertToUnit },
  };
  return converted;
};

type GPTotalQuantityTypes = {
  recipeIngredient: GPRecipeIngredientTypes;
  recipeIngredients: GPRecipeIngredientTypes[];
};
const getTotalQuantity = ({
  recipeIngredient,
  recipeIngredients,
}: GPTotalQuantityTypes) => {
  // for the current ingredient, check to see if there are any of the same ingredient in the list
  const sameIngredients = recipeIngredients.filter(
    (ingredient) =>
      ingredient.ingredientName === recipeIngredient.ingredientName
  );
  // loop through array of ingredients to get the quantity needed
  let totalQuantity = 0;
  if (sameIngredients.length > 1) {
    for (const ingredient of sameIngredients) {
      // check unit of ingredient
      if (
        unitConversions[recipeIngredient.unit.toLowerCase()] !==
        unitConversions[ingredient.unit.toLowerCase()]
      ) {
        const converted = convertUnits({
          convertTo: recipeIngredient,
          converting: ingredient,
        });
        totalQuantity += converted.converted.quantity;
      } else {
        totalQuantity += parseInt(ingredient.quantity);
      }
    }
  }
  return totalQuantity;
};

type GPQuantityNeededTypes = {
  ingredientOnHand: GPIngredientDataTypes;
  recipeIngredient: GPRecipeIngredientTypes;
};

const quantityNeeded = ({
  ingredientOnHand,
  recipeIngredient,
}: GPQuantityNeededTypes) => {
  let ingredientOnHandQuantity = ingredientOnHand.quantity;
  let recipeIngredientQuantity = parseInt(recipeIngredient.quantity);
  if (
    unitConversions[ingredientOnHand.unit.toLowerCase()] !==
    unitConversions[recipeIngredient.unit.toLowerCase()]
  ) {
    // need to convert recipe units to ingredient on hand units
    const converted = convertUnits({
      convertTo: ingredientOnHand,
      converting: recipeIngredient,
    });
    recipeIngredientQuantity = converted.converted.quantity;
  }
  if (recipeIngredientQuantity <= parseInt(ingredientOnHandQuantity)) {
    return 0;
  }
  return recipeIngredientQuantity - parseInt(ingredientOnHandQuantity);
};

type GPCreateGroceryListType = {
  recipeIngredients: GPRecipeIngredientTypes[];
  ingredientsOnHand: GPIngredientDataTypes[];
};

const createGroceryList = ({
  recipeIngredients,
  ingredientsOnHand,
}: GPCreateGroceryListType) => {
  let ingredientsToPurchase: GPRecipeIngredientTypes[] = [];
  // create an array of names of ingredients on hand to find index of ingredient
  const ingredientsOnHandNames = ingredientsOnHand.map((ingredient) =>
    ingredient.ingredientName.toLowerCase()
  );

  // loop through list of ingredients for recipe
  for (const recipeIngredient of recipeIngredients) {
    const alreadyInGroceryList = ingredientsToPurchase.find(
      (ingredient) =>
        ingredient.ingredientName === recipeIngredient.ingredientName
    );
    if (!alreadyInGroceryList) {
      const totalQuantity = getTotalQuantity({
        recipeIngredient,
        recipeIngredients,
      });
      const updatedIngredient =
        totalQuantity > 0
          ? { ...recipeIngredient, quantity: totalQuantity.toFixed(2) }
          : recipeIngredient;
      if (
        ingredientsOnHandNames.indexOf(
          recipeIngredient.ingredientName.toLowerCase()
        ) === -1
      ) {
        // user does not have ingredient, add to grocery list
        ingredientsToPurchase = [...ingredientsToPurchase, updatedIngredient];
      } else {
        // user has ingredient, check if they have enough
        const ingredientOnHand =
          ingredientsOnHand[
            ingredientsOnHandNames.indexOf(recipeIngredient.ingredientName)
          ];
        const quantityUserNeeds = quantityNeeded({
          ingredientOnHand,
          recipeIngredient: updatedIngredient,
        });
        if (quantityUserNeeds > 0) {
          ingredientsToPurchase = [
            ...ingredientsToPurchase,
            { ...updatedIngredient, quantity: quantityUserNeeds.toString() },
          ];
        }
      }
    }
  }
  return ingredientsToPurchase;
};

type GPEstimateListCostTypes = {
  ingredientsToPurchase: GPRecipeIngredientTypes[]
}

const estimateListCost = async ({ingredientsToPurchase}: GPEstimateListCostTypes) => {
  let estimatedCost = 0;
  for (const ingredient of ingredientsToPurchase) {
    const ingredientPrice = await getPriceOfIngredient({ingredient})
    estimatedCost += ingredientPrice
  }
  return estimatedCost;
}

type GPGetItemPriceType = {
  ingredient: GPRecipeIngredientTypes
}

const getPriceOfIngredient = async ({ingredient}: GPGetItemPriceType) => {
  const searchResults = await searchWalmart(ingredient.ingredientName)
  // get the price of the first result (most rellevant)
  const ingredientPrice = searchResults.items[0].salePrice
  // TODO implement check for item[0].size of item using convert quantity
  return ingredientPrice;
}

export {
  checkUserExists,
  convertUnits,
  getTotalQuantity,
  quantityNeeded,
  createGroceryList,
  estimateListCost
};
