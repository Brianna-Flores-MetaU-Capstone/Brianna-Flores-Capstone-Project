import { Request, Response } from "express";
import { getListOfMissingIngredients, estimateListCost } from "../utils/utils";

const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();



module.exports = router;