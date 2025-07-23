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
  "/createEvent",
  isAuthenticated,
  async (req: Request, res: Response) => {
    const { selectedRecipe, eventTitle, start, end, eventLink } = req.body;
    const userId = req.session.userId;
    try {
      const newEvent = await prisma.calendarEvent.create({
        data: {
          userId: userId,
          recipeId: selectedRecipe.id,
          eventTitle: eventTitle,
          start: start,
          end: end,
          eventLink: eventLink,
        },
      });
      if (!newEvent) {
        return res
          .status(400)
          .send("Error, failed to add the event to database");
      }
      res.json(newEvent);
    } catch (error) {
      res.status(500).send("Server Error");
    }
  },
);

router.get(
  "/calendarEvents",
  isAuthenticated,
  async (req: Request, res: Response) => {
    const userId = req.session.userId;
    try {
      const userCalendarEvents = await prisma.calendarEvent.findMany({
        where: {
          userId: userId,
        },
        include: {
          recipe: true,
        },
      });
      if (!userCalendarEvents) {
        res.status(404).send("Error, calendar events not found");
      }
      res.json(userCalendarEvents);
    } catch (error) {
      res.status(500).send("Server Error");
    }
  },
);

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
  },
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
  },
);

module.exports = router;
