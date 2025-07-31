import { Request, Response, NextFunction } from "express";
import type { includeSession } from "../types/session";
import { Prisma } from "@prisma/client";

const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
import { isAuthenticated } from "../utils/authMiddleware";
import { convertUnits } from "../utils/utils";

router.post("/totalNumRecipes", async (req: Request, res: Response) => {
  const { filter } = req.body;
  try {
    const numRecipes = await prisma.recipe.count({
      ...(filter !== "all" ? { where: { [filter]: true } } : {}),
    });
    res.json(numRecipes);
  } catch (error) {
    res.status(500).send("Error fetching number of recipes in database");
  }
});

router.post("/discover", async (req: Request, res: Response) => {
  const { filter, offset, numRequested } = req.body;
  try {
    const recipeData = await prisma.recipe.findMany({
      ...(filter !== "all" ? { where: { [filter]: true } } : {}),
      orderBy: {
        id: "desc",
      },
      skip: parseInt(offset),
      take: parseInt(numRequested),
    });
    res.json(recipeData);
  } catch (error) {
    res.status(500).send("Error fetching database recipes");
  }
});

router.post("/popular", async (req: Request, res: Response) => {
  const { offset, numRequested } = req.body;
  try {
    const mostPopular = await prisma.recipe.findMany({
      orderBy: {
        likes: "desc",
      },
      skip: parseInt(offset),
      take: parseInt(numRequested),
    });
    res.json(mostPopular);
  } catch (error) {
    res.status(500).send("Error fetching most popular recipes");
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
    const userData = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        recipes: {
          include: {
            calendarEvents: {
              where: {
                userId: userId,
                start: {
                  gte: new Date(),
                },
              },
            },
          },
        },
      },
    });
    res.json(userData.recipes);
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

// get a users favorited recipes' ids
router.get(
  "/favoritedIds",
  isAuthenticated,
  async (req: Request, res: Response) => {
    const userId = req.session.userId;
    try {
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
      res.json(userData.favoritedRecipes);
    } catch (error) {
      res.status(500).send("Server Error");
    }
  }
);

// get a users favorited recipes
router.get(
  "/favorited",
  isAuthenticated,
  async (req: Request, res: Response) => {
    const userId = req.session.userId;
    try {
      const userData = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          favoritedRecipes: true,
        },
      });
      res.json(userData.favoritedRecipes);
    } catch (error) {
      res.status(500).send("Server Error");
    }
  }
);

// get a users edited recipes
router.get("/edited", isAuthenticated, async (req: Request, res: Response) => {
  const userId = req.session.userId;
  try {
    const userData = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        editedRecipes: true,
      },
    });
    if (userData.editedRecipes.length === 0) {
      res.json([]);
    }
    res.json(userData.editedRecipes);
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

// add a new recipe to a users planned recipes to shop
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
      recipeTags,
      editingAuthorId,
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
      // check if recipe from API is in the database and not edited
      let recipe = null;
      if (!editedRecipe) {
        recipe = await prisma.Recipe.findFirst({
          where: {
            apiId: apiId,
            editingAuthorId: editingAuthorId,
          },
        });
      }
      if (!recipe) {
        // no original recipe from API found, make new recipe
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
            recipeTags,
          },
        });
      }
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

// Add recipe to users favorites list
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
          likes: { increment: 1 },
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

// remove recipe from users favorites list
router.put("/favorited/unfavorite", async (req: Request, res: Response) => {
  const userId = req.session.userId;
  const { selectedRecipe } = req.body;
  try {
    const updatedRecipe = await prisma.recipe.update({
      where: {
        id: selectedRecipe.id,
      },
      data: {
        likes: { decrement: 1 },
        usersThatFavorited: {
          disconnect: { id: userId },
        },
      },
    });
    res.json(updatedRecipe);
  } catch (error) {
    res.status(500).send("Failed to remove recipe from users list");
  }
});

// update user to remove recipe from planned recipes to shop list
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
