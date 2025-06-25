const router = require('express').Router() // combines the lines const router = require('express');
const bcrypt = require('bcrypt')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

import { Request, Response } from  "express";

// signup route
router.post("/signup", async(req: Request, res: Response) => {
    try {
        const { username, password } = req.body
        // ensure information is valid input (not emoty and password >8 characters)
        if (!username || !password) {
            return res.status(400).json({error: "Username and passowrd are required"})
        }

        if (password.length < 8) {
            return res.status(400).json({error: "Password must be at least 8 characters long"})
        }

        // does the user already exist
        const existingUser = await prisma.user.findUnique({
            where: { username } // check database if there is a username match
        })

        if (existingUser) {
            return res.status(400).json({error: "Username already exists"})
        }

        // if we made it here, its safe to create user
        // unsafe to store password in plaintext
        // create a hashed password
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await prisma.user.create({
            data: {
                username,
                password: hashedPassword // make sure you pass in the hashed password
            }
        })

        res.status(201).json({message: "signup was successful"})
    } catch (error) {
        console.error(error)
        res.status(500).json({error: "Something went wrong during signup!"})
    }
})

module.exports = router