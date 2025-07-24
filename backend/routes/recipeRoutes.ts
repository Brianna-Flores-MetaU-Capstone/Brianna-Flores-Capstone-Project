import { Request, Response, NextFunction } from "express";
import type { includeSession } from "../types/session";
import { Prisma } from "@prisma/client";

const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
import { isAuthenticated } from "../utils/authMiddleware";
import { convertUnits } from "../utils/utils";

router.post("/discover", async (req: Request, res: Response) => {
  const { filter, offset, numRequested } = req.body;
  try {
    const recipeData = await prisma.recipe.findMany({
      ...(filter !== "all" ? { where: { [filter]: true } } : {}),
      skip: parseInt(offset),
      take: parseInt(numRequested),
    });
    res.json(recipeData);
  } catch (error) {
    res.status(500).send("Error fetching database recipes");
  }
});

router.post(
  "/convertUnits",
  isAuthenticated,
  async (req: Request, res: Response) => {
    const { convertTo, converting } = req.body;
    const converted = convertUnits({ convertTo, converting });
    res.json(converted);
  }
);

router.get("/original/:apiId", async (req: Request, res: Response) => {
  const apiId = parseInt(req.params.apiId);
  try {
    const originalRecipe = await prisma.Recipe.findFirst({
      where: {
        apiId: apiId,
        editingAuthorId: null,
      },
    });
    if (!originalRecipe) {
      res.status(404).send("Error, original recipe not found");
    }
    res.json(originalRecipe);
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

// get a users planned recipes
router.get("/planned", isAuthenticated, async (req: Request, res: Response) => {
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

// get a users favorite recipes ids
router.get(
  "/favoritedIds",
  isAuthenticated,
  async (req: Request, res: Response) => {
    const userId = req.session.userId;
    try {
      // get the user data
      const userData = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          favoritedRecipes: {
            select: { id: true },
          },
        },
      });
      // return the users recipes
      res.json(userData.favoritedRecipes);
    } catch (error) {
      res.status(500).send("Server Error");
    }
  }
);

// get a users favorite recipes
router.get(
  "/favorited",
  isAuthenticated,
  async (req: Request, res: Response) => {
    const userId = req.session.userId;
    try {
      // get the user data
      const userData = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          favoritedRecipes: true,
        },
      });
      // return the users recipes
      res.json(userData.favoritedRecipes);
    } catch (error) {
      res.status(500).send("Server Error");
    }
  }
);

// add a new recipe for a user
router.post(
  "/planned/:userId",
  isAuthenticated,
  async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const {
      editedRecipe,
      apiId,
      originalSource,
      editingAuthorName,
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
      // check if recipe already in database and not edited
      let recipe = null;
      if (!editedRecipe) {
        // if recipe is edited, there will be 2 recipes with identical api ids
        // not an edited recipe, look for api id
        recipe = await prisma.Recipe.findFirst({
          where: {
            apiId: apiId,
            editingAuthorId: null,
          },
        });
      }

      if (!recipe) {
        // no recipe found or editing, make new recipe
        recipe = await prisma.recipe.create({
          data: {
            apiId,
            originalSource,
            editingAuthorName,
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
      const connector = editedRecipe
        ? { editingAuthor: { connect: { id: userId } } }
        : {
            users: {
              connect: {
                id: userId,
              },
            },
          };
      recipe = await prisma.recipe.update({
        where: {
          id: recipe.id,
        },
        data: {
          ...connector,
        },
      });
      res.json(recipe);
    } catch (error) {
      res.status(500).send("Server Error");
    }
  }
);

// Favorite a recipe for a user
router.post(
  "/favorited/:userId",
  isAuthenticated,
  async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const { selectedRecipe } = req.body;
    if (!selectedRecipe) {
      return res.status(400).send("Missing recipe info");
    }
    try {
      const recipe = await prisma.recipe.update({
        where: {
          id: selectedRecipe.id,
        },
        data: {
          usersThatFavorited: {
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

// update user to remove favorited recipe
router.put("/favorited/unfavorite", async (req: Request, res: Response) => {
  const userId = req.session.userId;
  const { selectedRecipe } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        favoritedRecipes: {
          disconnect: { id: selectedRecipe.id },
        },
      },
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).send("Failed to remove recipe from users list");
  }
});

// update user to remove recipe
router.put("/planned/remove", async (req: Request, res: Response) => {
  const userId = req.session.userId;
  const { deletedRecipe } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        recipes: {
          disconnect: { id: deletedRecipe.id },
        },
      },
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).send("Failed to remove recipe from users list");
  }
});

module.exports = router;
