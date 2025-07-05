import { Request, Response } from  "express";
const express = require("express")
const router = express.Router()

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// retrieve all ingredients in the database
router.get("/", async (req: Request, res: Response) => {
    try {
        const ingredients = await prisma.Ingredient.findMany()
        res.json(ingredients)
    } catch (error) {
        res.status(500).send("Server Error")
    }
})

// Get a specific ingredient by the name
router.get("/:ingredientName", async (req: Request, res: Response) => {
    const { name, quantity, unit, department, expiration } = req.query;
    // array of ingredients with name
    const ingredient = await prisma.Ingredient.findUnique({
        where: {
            uniqueIngredient: {
                ingredientName: name,
                quantity: quantity,
                unit: unit,
                department: department,
                expiration: expiration
            }
        }
    })
    console.log(ingredient)
    res.json(ingredient)
})

module.exports = router