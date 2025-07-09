import { Request, Response } from "express";
import { createGroceryList } from "../utils/utils";

const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

import { isAuthenticated } from "../utils/authMiddleware";

router.get("/", isAuthenticated, async (req: Request, res: Response) => {
  const userId = req.session.userId;
  try {
    const userData = await prisma.User.findUnique({
      where: {
        id: userId,
      },
    });
    res.json(userData.groceryList);
  } catch (error) {
    res.status(500).send("Error fetching user groceries");
  }
});

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

module.exports = router;
