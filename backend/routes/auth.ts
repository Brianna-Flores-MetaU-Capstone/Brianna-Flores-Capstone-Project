import { Request, Response } from  "express";
const router = require('express').Router() // combines the lines const router = require('express');
const bcrypt = require('bcrypt')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


// Allow the user to signup
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

// when a user tries to login: post request
router.post("/login", async(req: Request, res: Response) => {
    try {
        const { username, password } = req.body
        // ensure that username and password are valid (no empty strings)
        if (!username || !password) {
            return res.status(400).json({error: "Username and password are required"})
        }

        // search for username in database
        const user = await prisma.user.findUnique({
            where: { username }
        })
        if (!user) {
            return res.status(400).json({ error: "Invalid username or password." });
        }
        // if the user exists compare the entered password with the password associated with the username
        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            return res.status(400).json({error: "Invalid username or password"})
        }
        // store user id in a session so user doesnt have to continue to login
        req.session.userId = user.id;
        res.json({message: "login successful"})
    } catch (error) {
        console.error(error)
        res.status(500).json({error: "Something went wrong during login!"})
    }
})

// check if a user is logged in
router.get("/me", async(req: Request, res: Response) => {
    // const userId = req.session.userId;
    // if (!userId) {
    //     return res.status(401).json({error: "Not authenticated"})
    // }
    if (!req.session.userId) {
        return res.status(401).json({message: "Not logged in" })
    }
    const user = await prisma.user.findUnique({
        where: {id: req.session.userId},
        select: {username: true} // only return necessary data about the user (the username)
    })

    res.json({ id: req.session.userId, username: user.username })
})

// when a user logs in creates a session
// session id stored in users browser as cookie
// each request sends cookie to server to keep user logged in

module.exports = router
