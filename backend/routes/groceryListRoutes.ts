import { Request, Response, NextFunction } from "express";
import convert from "convert-units";
import type { includeSession } from "../types/session";
import type {
  GPRecipeIngredientTypes,
  GPIngredientDataTypes,
} from "../../frontend/src/utils/types";

const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

import { unitConversions } from "../utils/constants";

// TODO move into utils file to prevent code reuse
// middleware to check if a user is authenticated
const isAuthenticated = (
  req: includeSession,
  res: Response,
  next: NextFunction
) => {
  if (!req.session.userId) {
    return res
      .status(401)
      .json({ error: "You must be logged in to perform this action." });
  }
  next();
};

router.post(
  "/:userId",
  isAuthenticated,
  async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const { recipeIngredients, ingredientsOnHand } = req.body;
    const ingredientsToPurchase = createGroceryList({
      recipeIngredients,
      ingredientsOnHand,
    });
    try {
      const user = await prisma.User.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user) {
        return res.status(404).send("User not found");
      }
      const updatedUser = await prisma.User.update({
        where: {
          id: userId,
        },
        data: {
          groceryList: ingredientsToPurchase,
        },
      });
      res.json(updatedUser);
    } catch (error) {
      res.status(500).send("Failure to update user with grocery list");
    }
  }
);

type GPEnoughOnHandTypes = {
  ingredientOnHand: GPIngredientDataTypes;
  recipeIngredient: GPRecipeIngredientTypes;
};

const enoughOnHand = ({
  ingredientOnHand,
  recipeIngredient,
}: GPEnoughOnHandTypes) => {
  let ingredientOnHandUnit =
    unitConversions[ingredientOnHand.unit.toLowerCase()];
  let recipeIngredientUnit =
    unitConversions[recipeIngredient.unit.toLowerCase()];
  let ingredientOnHandQuantity = ingredientOnHand.quantity;
  let recipeIngredientQuantity = parseInt(recipeIngredient.quantity);
  if (ingredientOnHandUnit !== recipeIngredientUnit) {
    if (ingredientOnHandUnit && recipeIngredientUnit) {
      //ingredient units converted to convert-unit library compatible format
      recipeIngredientQuantity = convert(recipeIngredientQuantity)
        .from(recipeIngredientUnit)
        .to(ingredientOnHandUnit);
      recipeIngredientUnit = ingredientOnHandUnit;
    }
    // TODO: otherwise, one or both units null, assume user has enough??
  }
  // at this point ingredients are same unit
  if (recipeIngredientQuantity <= parseInt(ingredientOnHandQuantity)) {
    return true;
  }
  return false;
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
    if (
      ingredientsOnHandNames.indexOf(
        recipeIngredient.ingredientName.toLowerCase()
      ) === -1
    ) {
      // TODO: prevent multiple entries of a single ingredient in to purchase list, instead update object in list
      ingredientsToPurchase = [...ingredientsToPurchase, recipeIngredient];
    } else {
      const ingredientOnHand =
        ingredientsOnHand[
          ingredientsOnHandNames.indexOf(recipeIngredient.ingredientName)
        ];
      const userHasEnoughOfIngredient = enoughOnHand({
        ingredientOnHand,
        recipeIngredient,
      });
      if (!userHasEnoughOfIngredient) {
        ingredientsToPurchase = [...ingredientsToPurchase, recipeIngredient];
      }
    }
  }
  return ingredientsToPurchase;
};

module.exports = router;
