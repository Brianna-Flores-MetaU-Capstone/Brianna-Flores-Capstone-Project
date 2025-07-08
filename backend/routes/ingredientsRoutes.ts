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

type IngredientOnHand = {
  expirationDate: string;
  ingredient: {
    department: string;
    ingredientName: string;
  };
  ingredientId: number;
  quantity: number;
  unit: string;
};

// retrieve all ingredients for a given user
router.get("/", isAuthenticated, async (req: Request, res: Response) => {
  // check that user is authenticated
  const userId = req.session.userId;
  try {
    const ingredients = await prisma.IngredientsOnHand.findMany({
      where: {
        userId: userId,
      },
      include: {
        ingredient: true,
      },
    });
    // use map function to format ingredients for frontend use
    const parsedIngredients = ingredients.map(
      (ingredient: IngredientOnHand) => ({
        id: ingredient.ingredientId,
        ingredientName: ingredient.ingredient.ingredientName,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
        department: ingredient.ingredient.department,
        expirationDate: ingredient.expirationDate,
      })
    );
    res.json(parsedIngredients);
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
      department,
    });
    res.json(ingredient);
  } catch (error) {
    res.status(500).send("An error occurred while fetching the ingredient");
  }
});

// Add an ingredient to a users list
router.post(
  "/:userId",
  isAuthenticated,
  async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const { ingredientName, quantity, unit, department, expirationDate } =
      req.body;
    if (
      !ingredientName ||
      !quantity ||
      !unit ||
      !department ||
      !expirationDate
    ) {
      return res.status(400).send("Missing required ingredient fields");
    }
    try {
      // check to see if ingredient is in database
      let ingredient = await checkIngredientInDatabase({
        ingredientName,
        department,
      });

      // if ingredient not found, make it
      if (!ingredient) {
        ingredient = await prisma.Ingredient.create({
          data: {
            ingredientName,
            department,
          },
        });
      }

      if (!ingredient) {
        return res.status(400).send("Error, failed to create ingredient");
      }
      // check if user has ingredient
      let ingredientInUsersPantry = await prisma.IngredientsOnHand.findUnique({
        where: {
          userId_ingredientId: {
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
          userId: userId,
          ingredientId: ingredient.id,
          quantity: parseInt(quantity),
          unit,
          expirationDate,
        },
        include: {
          ingredient: true,
        },
      });
      const formattedIngredient = {
        ingredientId: ingredientInUsersPantry.id,
        ingredientName: ingredientInUsersPantry.ingredient.ingredientName,
        department: ingredientInUsersPantry.ingredient.department,
        quantity: ingredientInUsersPantry.quantity,
        unit: ingredientInUsersPantry.unit,
        expirationDate: ingredientInUsersPantry.expirationDate,
      };
      res.json(formattedIngredient);
    } catch (error) {
      res.status(500).send("An error occurred while creating the ingredient");
    }
  }
);

router.put(
  "/:ingredientId",
  isAuthenticated,
  async (req: Request, res: Response) => {
    const ingredientId = parseInt(req.params.ingredientId);
    const userId = req.session.userId;
    const { quantity, unit, expirationDate } = req.body;
    try {
      const ingredientOnHand = await prisma.ingredientsOnHand.findUnique({
        where: {
          userId_ingredientId: {
            userId,
            ingredientId,
          },
        },
      });
      if (!ingredientOnHand) {
        return res.status(404).send(`Ingredient ${ingredientId} not found`);
      }
      if (ingredientOnHand.userId !== userId) {
        return res
          .status(404)
          .send(`Ingredient ${ingredientId} not in users database`);
      }

      const updatedIngredient = await prisma.ingredientsOnHand.update({
        where: {
          userId_ingredientId: {
            userId,
            ingredientId,
          },
        },
        data: {
          quantity: parseInt(quantity),
          unit: unit,
          expirationDate: expirationDate,
        },
      });
      res.json(updatedIngredient);
    } catch (error) {
      res.status(500).send("Failed to update ingredient");
    }
  }
);

router.delete(
  "/:ingredientId",
  isAuthenticated,
  async (req: Request, res: Response) => {
    const ingredientId = parseInt(req.params.ingredientId);
    const userId = req.session.userId;
    try {
      const ingredientOnHand = await prisma.ingredientsOnHand.findUnique({
        where: {
          userId_ingredientId: {
            userId,
            ingredientId,
          },
        },
      });
      if (!ingredientOnHand) {
        return res.status(404).send(`Ingredient ${ingredientId} not found`);
      }
      if (ingredientOnHand.userId !== userId) {
        return res
          .status(404)
          .send(`Ingredient ${ingredientId} not in users database`);
      }

      const deletedIngredient = await prisma.ingredientsOnHand.delete({
        where: {
          userId_ingredientId: {
            userId,
            ingredientId,
          },
        },
      });
      res.json(deletedIngredient);
    } catch (error) {
      res.status(500).send("Failed to delete ingredient");
    }
  }
);

type GPIngredientDatabaseTypes = {
  ingredientName: string;
  department: string;
};

const checkIngredientInDatabase = async ({
  ingredientName,
  department,
}: GPIngredientDatabaseTypes) => {
  const ingredient = await prisma.Ingredient.findFirst({
    where: {
      ingredientName: ingredientName.toLowerCase(),
      department: department.toString(),
    },
  });
  return ingredient;
};

module.exports = router;
