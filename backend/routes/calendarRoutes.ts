import { Request, Response } from "express";

const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

import { isAuthenticated } from "../utils/authMiddleware";
import { getShoppingTimeOptions, getRecipeTimeOptions } from "../utils/calendarUtils";
const SHOPPING_TIME = 60

router.post(
  "/reccomendEvents",
  isAuthenticated,
  async (req: Request, res: Response) => {
    // get parsed list of events from google calendar
    const { parsedFreeTime } = req.body;
    const userId = req.session.userId;
    try {
      const user = await prisma.User.findUnique({
        where: {
          id: userId,
        },
        include: {
          recipes: true,
        },
      });
      if (!user) {
        return res.status(404).send("User not found");
      }
      // now we have the users list of recipes
      const userSelectedRecipes = user.recipes;
      // determine reccomended time slots to shop
      // approximate shopping time to be 1 hour
      const shoppingTimeOptions = getShoppingTimeOptions({userFreeTime: parsedFreeTime, shoppingTime: SHOPPING_TIME})
      const recipeTimeOptions = getRecipeTimeOptions({userFreeTime: parsedFreeTime, userRecipes: userSelectedRecipes})
      res.json(recipeTimeOptions);
    } catch (error) {
      res.status(500).send("Error finding empty time slots");
    }
  }
);

module.exports = router;
