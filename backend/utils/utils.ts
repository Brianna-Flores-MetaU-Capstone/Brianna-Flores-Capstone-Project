import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import type {
  GPRecipeIngredientTypes,
  GPIngredientDataTypes,
} from "../../frontend/src/utils/types/types";
import { unitConversions } from "./constants";
import convert from "convert-units";
import { searchWalmart } from "./walmartAPI";

const checkUserExists = async (firebaseId: string) => {
  const user = await prisma.user.findUnique({
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
  let convertingQuantity = converting.quantity;
  if (convertToUnit && convertingUnit) {
    // ingredient units converted to convert-unit library compatible format
    try {
      convertingQuantity = convert(convertingQuantity)
        .from(convertingUnit)
        .to(convertToUnit);
      convertingUnit = convertToUnit;
    } catch (error) {
      convertingQuantity = converting.quantity;
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
      ingredient.ingredientName === recipeIngredient.ingredientName,
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
        totalQuantity += ingredient.quantity;
      }
    }
  } else {
    totalQuantity = recipeIngredient.quantity;
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
  let recipeIngredientQuantity = recipeIngredient.quantity;
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
  if (recipeIngredientQuantity <= ingredientOnHandQuantity) {
    return 0;
  }
  return recipeIngredientQuantity - ingredientOnHandQuantity;
};

type GPMissingIngredientsListType = {
  recipeIngredients: GPRecipeIngredientTypes[];
  ownedIngredients: GPIngredientDataTypes[];
};

const getListOfMissingIngredients = ({
  recipeIngredients,
  ownedIngredients,
}: GPMissingIngredientsListType) => {
  let ingredientsToPurchase: GPRecipeIngredientTypes[] = [];
  // create an array of names of ingredients on hand to find index of ingredient
  const ownedIngredientsNames = ownedIngredients.map((ingredient) =>
    ingredient.ingredientName.toLowerCase(),
  );

  // loop through list of ingredients for recipe
  for (const recipeIngredient of recipeIngredients) {
    const alreadyInGroceryList = ingredientsToPurchase.find(
      (ingredient) =>
        ingredient.ingredientName.toLowerCase() ===
        recipeIngredient.ingredientName.toLowerCase(),
    );
    if (!alreadyInGroceryList) {
      const totalQuantity = getTotalQuantity({
        recipeIngredient,
        recipeIngredients,
      });
      const updatedIngredient = {
        ...recipeIngredient,
        quantity: totalQuantity,
      };
      if (
        ownedIngredientsNames.indexOf(
          recipeIngredient.ingredientName.toLowerCase(),
        ) === -1
      ) {
        // user does not have ingredient, add to grocery list
        ingredientsToPurchase = [...ingredientsToPurchase, updatedIngredient];
      } else {
        // user has ingredient, check if they have enough
        const ingredientOnHand =
          ownedIngredients[
            ownedIngredientsNames.indexOf(
              recipeIngredient.ingredientName.toLowerCase(),
            )
          ];
        const quantityUserNeeds = quantityNeeded({
          ingredientOnHand,
          recipeIngredient: updatedIngredient,
        });
        if (quantityUserNeeds > 0) {
          ingredientsToPurchase = [
            ...ingredientsToPurchase,
            { ...updatedIngredient, quantity: quantityUserNeeds },
          ];
        }
      }
    }
  }
  return ingredientsToPurchase;
};

type GPEstimateListCostTypes = {
  ingredientsToPurchase: GPRecipeIngredientTypes[];
};

const estimateListCost = async ({
  ingredientsToPurchase,
}: GPEstimateListCostTypes) => {
  let ingredientCostInfo: GPIngredientDataTypes[] = [];
  let estimatedCost = 0;
  for (const ingredient of ingredientsToPurchase) {
    const ingredientApiInfo = await getCostForAmountOfIngredient({
      ingredient,
    });
    const ingredientCost = ingredientApiInfo.ingredientCost;
    estimatedCost += ingredientCost;
    ingredientCostInfo = [
      ...ingredientCostInfo,
      {
        ...ingredient,
        isChecked: false,
        ...ingredientApiInfo,
      },
    ];
  }
  return { ingredientCostInfo, estimatedCost };
};

type GPGetItemCostType = {
  ingredient: GPRecipeIngredientTypes;
};

const getCostForAmountOfIngredient = async ({
  ingredient,
}: GPGetItemCostType) => {
  const searchResults = await searchWalmart(ingredient.ingredientName);
  // get the cost and quantity of first result (most rellevant)
  if (searchResults?.items) {
    const ingredientCost = searchResults.items[0]?.salePrice ?? 0;
    const ingredientCostUnit =
      searchResults.items[0]?.size ?? "Price not Found";
    return { ingredientCost, ingredientCostUnit };
  }
  return { ingredientCost: 0, ingredientCostUnit: "Price not Found" };
};

export {
  checkUserExists,
  convertUnits,
  quantityNeeded,
  getListOfMissingIngredients,
  estimateListCost,
};
