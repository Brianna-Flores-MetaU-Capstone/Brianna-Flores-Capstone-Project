import { Request, Response } from "express";
import session from "express-session";
import dotenv from "dotenv";
dotenv.config();
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("No session secret on no!");
}

let sessionConfig = {
  name: "sessionId",
  secret: sessionSecret,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    secure: process.env.RENDER ? true : false,
    httpOnly: false,
  },
  resave: false,
  saveUninitialized: false,
};

app.use(session(sessionConfig));

app.use(express.json());

const ingredientsRoutes = require("./routes/ingredientsRoutes");
app.use("/ingredients", ingredientsRoutes);

const recipeRoutes = require("./routes/recipeRoutes");
app.use("/recipes", recipeRoutes);

const groceryListRoutes = require("./routes/groceryListRoutes");
app.use("/generateList", groceryListRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// TODO: Change root directory behavior
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to my app!");
});