import { Request, Response } from  "express";
const express = require('express');
const app = express();
const PORT = 3000;
const cors = require('cors')
app.use(cors())
app.use(express.json())

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const ingredientsRoutes = require("./routes/ingredientsRoutes")
app.use("/ingredients", ingredientsRoutes)

const authRoutes = require('./routes/authRoutes')
app.use('/', authRoutes)


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

// TODO: Change root directory behavior
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to my app!')
})