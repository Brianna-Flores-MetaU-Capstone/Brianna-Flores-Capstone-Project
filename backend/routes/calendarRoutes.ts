import { Request, Response } from "express";

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
      // add boolean for whether shopping slot has been assigned (ensure shopping slot assigned first)
      
      res.json("TODO: return list of empty spaces in calendar")
    } catch (error) {
        res.status(500).send("Error finding empty time slots")
    }
  }
);

module.exports = router;