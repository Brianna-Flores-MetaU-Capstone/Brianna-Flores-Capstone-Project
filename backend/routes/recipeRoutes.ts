import { Request, Response, NextFunction } from "express";
import type { includeSession } from "../types/session";
import { Prisma } from "@prisma/client";

const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
import { isAuthenticated } from "../utils/authMiddleware";
import { convertUnits } from "../utils/utils";

router.post("/discover/:filter", async (req: Request, res: Response) => {
  const filter = req.params.filter
  const {offset, numRequested} = req.body
  try {
    const recipeData = await prisma.recipe.findMany({
      where: { filter: true },
      skip: offset,
      take: numRequested,
    })
    res.json(recipeData)
  } catch (error) {
    res.status(500).send("Error fetching database recipes")
  }
})

router.post("/convertUnits", isAuthenticated, async (req: Request, res: Response) => {
  const { convertTo, converting } = req.body;
  const converted = convertUnits({convertTo, converting});
  res.json(converted)
})

// get a users recipes
router.get("/", isAuthenticated, async (req: Request, res: Response) => {
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
    // return the users recipes
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
      readyInMinutes,
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
      !sourceUrl || 
      !readyInMinutes
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
            readyInMinutes,
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

// update user to remove recipe
router.put("/:apiId", async (req: Request, res: Response) => {
  const userId = req.session.userId;
  const recipeApiId = parseInt(req.params.apiId);
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        recipes: {
          disconnect: { apiId: recipeApiId },
        },
      },
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).send("Failed to remove recipe from users list");
  }
});

module.exports = router;
