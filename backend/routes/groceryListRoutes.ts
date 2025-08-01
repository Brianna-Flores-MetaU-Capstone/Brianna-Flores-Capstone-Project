import { Request, Response } from "express";
import {
  getListOfMissingIngredients,
  estimateListCost,
  updateEstimatedListCost,
} from "../utils/utils";

const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

import { isAuthenticated } from "../utils/authMiddleware";
import { IngredientData } from "../../shared/IngredientData";

router.get("/", isAuthenticated, async (req: Request, res: Response) => {
  const userId = req.session.userId;
  try {
    const userData = await prisma.User.findUnique({
      where: {
        id: userId,
      },
    });
    res.json({
      groceryList: userData.groceryList,
      groceryListCost: userData.groceryListCost,
    });
  } catch (error) {
    res.status(500).send("Error fetching user groceries");
  }
});

router.put("/clear", isAuthenticated, async (req: Request, res: Response) => {
  const userId = req.session.userId;
  try {
    const user = await prisma.User.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return res.status(404).send("User not found");
    }
    const clearedList = user.groceryList.filter(
      (ingredientItem: IngredientData) => {
        return !ingredientItem.isChecked;
      }
    );
    const updatedGroceryListPrice = updateEstimatedListCost({
      ingredientsToPurchase: clearedList,
    });
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        groceryList: clearedList,
        groceryListCost: updatedGroceryListPrice,
      },
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).send("Error updating grocery list");
  }
});

router.put("/delete", isAuthenticated, async (req: Request, res: Response) => {
  const userId = req.session.userId;
  const { ingredientName } = req.body;
  try {
    const user = await prisma.User.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return res.status(404).send("User not found");
    }
    const deletedFromList = user.groceryList.filter(
      (ingredient: IngredientData) =>
        ingredient.ingredientName.toLowerCase() !== ingredientName.toLowerCase()
    );
    const updatedGroceryListPrice = updateEstimatedListCost({ingredientsToPurchase: deletedFromList});
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        groceryList: deletedFromList,
        groceryListCost: updatedGroceryListPrice,
      },
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).send("Error deleting item from grocery list");
  }
});

router.put("/check", isAuthenticated, async (req: Request, res: Response) => {
  const userId = req.session.userId;
  const { ingredientName } = req.body;
  try {
    const user = await prisma.User.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return res.status(404).send("User not found");
    }
    const checkedGroceryList = user.groceryList.map(
      (ingredientItem: IngredientData) =>
        ingredientItem.ingredientName.toLowerCase() ===
        ingredientName.toLowerCase()
          ? {
              ...ingredientItem,
              isChecked: !ingredientItem.isChecked,
            }
          : ingredientItem
    );
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        groceryList: checkedGroceryList,
      },
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).send("Error updating grocery list");
  }
});

router.post(
  "/estimateCost",
  isAuthenticated,
  async (req: Request, res: Response) => {
    const { recipeIngredients, ownedIngredients } = req.body;
    const ingredientsToPurchase = getListOfMissingIngredients({
      recipeIngredients,
      ownedIngredients,
    });
    try {
      const estimatedCost = await estimateListCost({ ingredientsToPurchase });
      res.json(estimatedCost);
    } catch (error) {
      res.status(500).send("Error approximating ingredients cost");
    }
  }
);

router.post(
  "/:userId",
  isAuthenticated,
  async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const { recipeIngredients, ownedIngredients } = req.body;
    const ingredientsToPurchase = getListOfMissingIngredients({
      recipeIngredients,
      ownedIngredients,
    });
    const estimatedCost = await estimateListCost({ ingredientsToPurchase });
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
          groceryList: estimatedCost.ingredientCostInfo,
          groceryListCost: estimatedCost.estimatedCost,
        },
      });
      res.json(updatedUser);
    } catch (error) {
      res.status(500).send("Failure to update user with grocery list");
    }
  }
);

module.exports = router;
