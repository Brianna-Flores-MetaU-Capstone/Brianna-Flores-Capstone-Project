import { Request, Response } from "express";
const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// retrieve all ingredients in the database
router.get("/", async (req: Request, res: Response) => {
  try {
    const ingredients = await prisma.Ingredient.findMany();
    res.json(ingredients);
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

// Get a specific ingredient by the name
router.get("/:ingredientName", async (req: Request, res: Response) => {
  const ingredientName = req.params.ingredientName;
  const { quantity, unit, department, expiration } = req.body;
  try {
    const ingredient = checkIngredientInDatabase(
      {ingredientName,
      quantity,
      unit,
      department,
      expiration}
    );
    res.json(ingredient);
  } catch (error) {
    res.status(500).send("An error occurred while fetching the ingredient");
  }
});

// Add an ingredient to the list
router.post("/:userId", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
  const { ingredientName, quantity, unit, department, expiration } = req.body;
  if (!ingredientName || !quantity || !unit || !department || !expiration) {
    return res.status(400).send("Missing required ingredient fields");
  }
  try {
    // check to see if ingredient is in database
    let ingredient = await checkIngredientInDatabase(
      {ingredientName,
      quantity,
      unit,
      department,
      expiration}
    );

    // if ingredient not found, make it
    if (!ingredient) {
        ingredient = await prisma.Ingredient.create({
            data: {
                ingredientName,
                quantity: parseInt(quantity),
                unit,
                department,
                expiration,
        },
        });
    }

    if (!ingredient) {
        return res.status(400).send("Error, failed to create ingredient")
    }

    // check if user has ingredient
    let ingredientInUsersPantry = await prisma.IngredientsOnHand.findUnique({
        where: {
            IngredientsOnHandId: {
                userId,
                ingredientId: ingredient.id,
            }
        }
    })

    // if the user already has the ingredient on hand, prevent user from adding ingredient and ask them to modify instead
    if (ingredientInUsersPantry) {
        return res.status(400).send("Error, ingredient already in pantry, try to update :)")
    }

    // create mapping in table from user to ingredient
    ingredientInUsersPantry = await prisma.IngredientsOnHand.create({
        data: {
            user: { 
                connect: {
                    id: userId
                }
            },
            ingredient: {
                connect: {
                    id: ingredient.id
                }
            },
        }
    })

    res.json(ingredient)

  } catch (error) {
    res.status(500).send("An error occurred while creating the ingredient");
  }
});

type GPIngredientDatabaseTypes = {
  ingredientName: string;
  quantity: number;
  unit: string;
  department: string;
  expiration: string;
};

const checkIngredientInDatabase = async ({
  ingredientName,
  quantity,
  unit,
  department,
  expiration,
}: GPIngredientDatabaseTypes) => {
  const ingredient = await prisma.Ingredient.findUnique({
    where: {
      uniqueIngredient: {
        ingredientName: ingredientName.toLowerCase(),
        quantity: quantity,
        unit: unit.toString(),
        department: department.toString(),
        expiration: expiration ? expiration.toString() : null,
      },
    },
  });
  return ingredient;
};

module.exports = router;
