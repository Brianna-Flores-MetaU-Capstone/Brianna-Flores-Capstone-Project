import { Request, Response, NextFunction } from "express";
import type { includeSession } from "../types/session";

const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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

// retrieve all ingredients for a given user
router.get("/", isAuthenticated, async (req: Request, res: Response) => {
  // check that user is authenticated
  const userId = req.session.userId;
  try {
    const ingredients = await prisma.ingredientsOnHand.findMany({
      where: {
        userId: userId,
      },
      include: {
        ingredient: true,
      },
    });
    res.json(ingredients);
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

// Get a specific ingredient by the name
router.get("/:ingredientName", async (req: Request, res: Response) => {
  const ingredientName = req.params.ingredientName;
  const { quantity, unit, department, expirationDate } = req.body;
  try {
    const ingredient = checkIngredientInDatabase({
      ingredientName,
      quantity,
      unit,
      department,
      expirationDate,
    });
    res.json(ingredient);
  } catch (error) {
    res.status(500).send("An error occurred while fetching the ingredient");
  }
});

// Add an ingredient to a users list
// router.post("/:userId", isAuthenticated, async (req: Request, res: Response) => {
router.post("/:userId", async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);
  const { ingredientName, quantity, unit, department, expirationDate } =
    req.body;
  if (!ingredientName || !quantity || !unit || !department || !expirationDate) {
    return res.status(400).send("Missing required ingredient fields");
  }
  try {
    // check to see if ingredient is in database
    let ingredient = await checkIngredientInDatabase({
      ingredientName,
      quantity,
      unit,
      department,
      expirationDate,
    });

    // if ingredient not found, make it
    if (!ingredient) {
      ingredient = await prisma.Ingredient.create({
        data: {
          ingredientName,
          quantity: parseInt(quantity),
          unit,
          department,
          expirationDate,
        },
      });
    }

    if (!ingredient) {
      return res.status(400).send("Error, failed to create ingredient");
    }
    // check if user has ingredient
    let ingredientInUsersPantry = await prisma.IngredientsOnHand.findUnique({
      where: {
        IngredientsOnHandId: {
          userId,
          ingredientId: ingredient.id,
        },
      },
    });
    // if the user already has the ingredient on hand, prevent user from adding ingredient and ask them to modify instead
    if (ingredientInUsersPantry) {
      return res
        .status(400)
        .send("Error, ingredient already in pantry, try to update :)");
    }

    // create mapping in table from user to ingredient
    ingredientInUsersPantry = await prisma.IngredientsOnHand.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        ingredient: {
          connect: {
            id: ingredient.id,
          },
        },
      },
    });
    res.json(ingredient);
  } catch (error) {
    res.status(500).send("An error occurred while creating the ingredient");
  }
});

type GPIngredientDatabaseTypes = {
  ingredientName: string;
  quantity: string;
  unit: string;
  department: string;
  expirationDate: string;
};

const checkIngredientInDatabase = async ({
  ingredientName,
  quantity,
  unit,
  department,
  expirationDate,
}: GPIngredientDatabaseTypes) => {
  const ingredient = await prisma.Ingredient.findFirst({
    where: {
      ingredientName: ingredientName.toLowerCase(),
      quantity: parseInt(quantity),
      unit: unit.toString(),
      department: department.toString(),
      expirationDate: expirationDate ? expirationDate.toString() : null,
    },
  });
  return ingredient;
};

module.exports = router;
