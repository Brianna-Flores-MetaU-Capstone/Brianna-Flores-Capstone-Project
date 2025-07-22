import { Request, Response } from "express";

const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

import { isAuthenticated } from "../utils/authMiddleware";
import {
  getShoppingTimeOptions,
  getMultipleScheduleOptions,
} from "../utils/calendarUtils";
const SHOPPING_TIME = 60;
const NUM_SCHEDULE_OPTIONS = 3;
const SINGLE_RECIPE_SCHEDULE_OPTIONS = 1;

router.post(
  "/reccomendEvents",
  isAuthenticated,
  async (req: Request, res: Response) => {
    // get parsed list of events from google calendar
    const { parsedFreeTime, userPreferences, singleDayPrep, servingsPerDay } =
      req.body;
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
      // determine recommended time slots to shop
      // approximate shopping time to be 1 hour
      const shoppingTimeOptions = getShoppingTimeOptions({
        userFreeTime: parsedFreeTime,
        shoppingTime: SHOPPING_TIME,
      });
      const recipeScheduleOptions = getMultipleScheduleOptions({
        userFreeTime: parsedFreeTime,
        userRecipes: userSelectedRecipes,
        userPreferences: userPreferences,
        singleDayPrep: singleDayPrep,
        servingsPerDay: servingsPerDay,
        numOptions: NUM_SCHEDULE_OPTIONS,
      });
      res.json(recipeScheduleOptions);
    } catch (error) {
      res.status(500).send("Error finding empty time slots");
    }
  }
);

router.post(
  "/single/reccomendEvents",
  isAuthenticated,
  async (req: Request, res: Response) => {
    const { parsedFreeTime, userPreferences, recipeInfo } = req.body;
    const recipeScheduleOptions = getMultipleScheduleOptions({
      userFreeTime: parsedFreeTime,
      userRecipes: [recipeInfo],
      userPreferences: userPreferences,
      singleDayPrep: false,
      servingsPerDay: 1,
      numOptions: SINGLE_RECIPE_SCHEDULE_OPTIONS,
    });
    res.json(recipeScheduleOptions);
  }
);

module.exports = router;
