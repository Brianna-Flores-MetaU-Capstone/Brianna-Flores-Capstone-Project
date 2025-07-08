import { Request, Response, NextFunction } from "express";
import type { includeSession } from "../types/session";
import { Prisma } from "@prisma/client";

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

router.get("/", isAuthenticated, async (req: Request, res: Response) => {
  // check that user is authenticated
  const userId = req.session.userId;
  try {
    // get the user data
    const userData = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        recipes: true,
      },
    });
    res.json(userData.recipes);
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

// add a new recipe for a user
router.post(
  "/:userId",
  isAuthenticated,
  async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const {
      apiId,
      recipeTitle,
      previewImage,
      servings,
      ingredients,
      sourceUrl,
      instructions,
      vegetarian,
      vegan,
      glutenFree,
      dairyFree,
    } = req.body;
    if (
      !apiId ||
      !recipeTitle ||
      !previewImage ||
      !servings ||
      !ingredients ||
      !sourceUrl
    ) {
      return res.status(400).send("Missing required recipe fields");
    }
    try {
      // check if recipe already in database
      let recipe = await prisma.Recipe.findUnique({
        where: {
          apiId: apiId,
        },
      });

      if (!recipe) {
        // no recipe found, make new recipe
        recipe = await prisma.Recipe.create({
          data: {
            apiId,
            recipeTitle,
            previewImage,
            servings,
            ingredients: ingredients as Prisma.JsonArray,
            sourceUrl,
            instructions,
            vegetarian,
            vegan,
            glutenFree,
            dairyFree,
          },
        });
      }
      // check if failure to create recipe
      if (!recipe) {
        return res.status(400).send("Error, failed to create recipe");
      }
      recipe = await prisma.recipe.update({
        where: {
          apiId: apiId,
        },
        data: {
          users: {
            connect: {
              id: userId,
            },
          },
        },
      });
      res.json(recipe);
    } catch (error) {
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
