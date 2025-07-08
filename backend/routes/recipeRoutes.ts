import { Request, Response, NextFunction } from "express";
import type { includeSession } from "../types/session";

const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// middleware to check if a user is authenticated
const isAuthenticated = (
  req: includeSession,
  res: Response,
  next: NextFunction
) => {
  if (!req.session.userId) {
    return res
      .status(401)
      .json({ error: "You must be logged in to perform this action." });
  }
  next();
};

// retrieve all of a users recipes to make
router.get("/", isAuthenticated, async (req: Request, res: Response) => {
  // check that user is authenticated
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
    res.json(userData.recipes);
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;