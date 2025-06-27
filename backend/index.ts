// get the types for defining req and resAdd commentMore actions
import { Request, Response } from  "express";
const express = require('express');
const app = express();
const PORT = 3000;
const cors = require('cors')
app.use(cors())
app.use(express.json())


// import prisma
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

app.post('/signup', async (req: Request, res: Response) => {
  console.log("in signup")
    if (!req.body.firebaseId || !req.body.email) {
        return res.status(400).send("Id and email are required");
    }
    const { firebaseId, email } = req.body
    const newUser = await prisma.user.create({
        data: {
            firebaseId,
            email,
        }
    })
    console.log(newUser)
    res.json(newUser)
})


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to my app!')
})

// // modify the express session module to allow extraction of userId from session in auth.ts
// declare module 'express-session' {
//   interface SessionData {
//     userId?: string
//   }
// }
// const session = require('express-session')

// // takes in json format


// // allow to import data from .env file
// import dotenv from 'dotenv'; 
// dotenv.config();

// let sessionConfig = {
//   name: 'sessionId',
//   secret: process.env.SESSION_SECRET, 
//   cookie: {
//     maxAge: 1000 * 60 * 5,
//     secure: process.env.RENDER ? true : false,
//   }
// }

// app.use(session(sessionConfig))

