import { Request, Response } from "express";
import admin from "../firebase/firebase";
import type { includeSession } from "../types/session";
import { checkUserExists } from "../utils/utils";
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const express = require("express");
const router = express.Router();

// add a user to the database on signup
router.post("/signup", async (req: Request, res: Response) => {
  try {
    if (!req.body.firebaseId || !req.body.email) {
      return res.status(400).send("Id and email are required");
    }
    const { firebaseId, email, intolerances, diets } = req.body;
    const newUser = await prisma.user.create({
      data: {
        firebaseId,
        email,
        intolerances,
        diets,
      },
    });
    res.json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong during signup!" });
  }
});

// get the user data from the database based on their firebase id
router.get("/account/:firebaseId", async (req: Request, res: Response) => {
  const firebaseId = req.params.firebaseId;
  try {
    const user = await checkUserExists(firebaseId);

    if (user) {
      res.json(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    res.status(500).send("An error occurred while fetching the user");
  }
});

// Update a users profile
router.put("/account/:firebaseId", async (req: Request, res: Response) => {
  if (!req.body.email || !req.body.intolerances || !req.body.diets) {
    return res.status(400).send("Missing requirements");
  }
  const firebaseId = req.params.firebaseId;
  const { email, intolerances, diets } = req.body;
  try {
    const user = await checkUserExists(firebaseId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    const updatedUser = await prisma.User.update({
      where: { firebaseId: firebaseId },
      data: {
        email,
        intolerances,
        diets,
      },
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).send("An error occurred while updating the user");
  }
});

// validate a user after login using token
router.post("/login", async (req: includeSession, res: Response) => {
  const idToken = req.body.token;
  if (!idToken) {
    return res.status(401).send("Missing token");
  }
  // verify the users token
  admin
    .auth()
    .verifyIdToken(idToken)
    .then(async (decodedToken) => {
      const uid = decodedToken.uid;
      const user = await prisma.user.findUnique({
        where: { firebaseId: uid },
      });
      // store user id to establish a session
      req.session.userId = user.id;
      const userAccount = { id: user.id, userName: user.userName };
      res.json(userAccount);
    })
    .catch((error) => {
      res.status(500).send("Error durring login");
    });
});

router.post("/logout", (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to log out" });
    }
    res.clearCookie("sessionId");
    res.json({ message: "Logged out successfully" });
  });
});

router.get("/me", async (req: Request, res: Response) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not logged in" });
  }
  try {
    const user = await prisma.User.findUnique({
      where: { id: req.session.userId },
    });
    res.json({
      id: req.session.userId,
      userName: user.userName,
      intolerances: user.intolerances,
      diets: user.diets,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching user session data" });
  }
});

module.exports = router;
