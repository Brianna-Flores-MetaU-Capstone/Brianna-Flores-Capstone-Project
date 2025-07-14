import { Request, Response } from "express";
import { getListOfMissingIngredients, estimateListCost } from "../utils/utils";

const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

import { isAuthenticated } from "../utils/authMiddleware";

router.post(
  "/reccomendEvents",
  isAuthenticated,
  async (req: Request, res: Response) => {
    // get parsed list of events from google calendar
    const { userEvents } = req.body;
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
      console.log(userSelectedRecipes);
    } catch (error) {}
  }
);

module.exports = router;
