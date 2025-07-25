import { Request, Response, NextFunction } from "express";
import type { includeSession } from "../types/session";

const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
import { isAuthenticated } from "../utils/authMiddleware";

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
  const userId = req.session.userId;
  try {
    const ingredients = await prisma.OwnedIngredient.findMany({
      where: {
        userId: userId,
      },
      include: {
        ingredient: true,
      },
    });
    // Format ingredients for frontend use
    const parsedIngredients = ingredients.map(
      (ingredient: IngredientOnHand) => ({
        id: ingredient.ingredientId,
        ingredientName: ingredient.ingredient.ingredientName,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
        department: ingredient.ingredient.department,
        expirationDate: ingredient.expirationDate,
      }),
    );
    res.json(parsedIngredients);
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

// Get a specific ingredient by name
router.get("/:ingredientName", async (req: Request, res: Response) => {
  const ingredientName = req.params.ingredientName.toLowerCase();
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

// Add ingredient to a users list on owned ingredients
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
      let ingredientInDatabase = await checkIngredientInDatabase({
        ingredientName,
        department,
      });

      if (!ingredientInDatabase) {
        ingredientInDatabase = await prisma.Ingredient.create({
          data: {
            ingredientName: ingredientName.toLowerCase(),
            department,
          },
        });
      }

      if (!ingredientInDatabase) {
        return res.status(400).send("Error, failed to create ingredient");
      }
      let ingredientInUsersPantry = await prisma.OwnedIngredient.findUnique({
        where: {
          userId_ingredientId: {
            userId,
            ingredientId: ingredientInDatabase.id,
          },
        },
      });
      // if the user already has the ingredient on hand, prevent user from adding ingredient and ask them to modify instead
      if (ingredientInUsersPantry) {
        return res
          .status(400)
          .send("Error, ingredient already in pantry, try to update :)");
      }

      // mapping ingredient to user
      ingredientInUsersPantry = await prisma.OwnedIngredient.create({
        data: {
          userId: userId,
          ingredientId: ingredientInDatabase.id,
          quantity: parseFloat(quantity),
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
  },
);

router.put(
  "/:ingredientId",
  isAuthenticated,
  async (req: Request, res: Response) => {
    const ingredientId = parseInt(req.params.ingredientId);
    const userId = req.session.userId;
    const { quantity, unit, expirationDate } = req.body;
    try {
      const ingredientOnHand = await prisma.OwnedIngredient.findUnique({
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

      const updatedIngredient = await prisma.OwnedIngredient.update({
        where: {
          userId_ingredientId: {
            userId,
            ingredientId,
          },
        },
        data: {
          quantity: parseFloat(quantity),
          unit: unit,
          expirationDate: expirationDate,
        },
      });
      res.json(updatedIngredient);
    } catch (error) {
      res.status(500).send("Failed to update ingredient");
    }
  },
);

router.delete(
  "/:ingredientId",
  isAuthenticated,
  async (req: Request, res: Response) => {
    const ingredientId = parseInt(req.params.ingredientId);
    const userId = req.session.userId;
    try {
      const ingredientOnHand = await prisma.OwnedIngredient.findUnique({
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

      const deletedIngredient = await prisma.OwnedIngredient.delete({
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
  },
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
