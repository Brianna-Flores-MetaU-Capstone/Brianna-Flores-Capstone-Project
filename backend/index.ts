import { Request, Response } from  "express";
const express = require('express');
const app = express();
const PORT = 3000;
const cors = require('cors')
app.use(cors())
app.use(express.json())

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