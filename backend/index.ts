// get the types for defining req and res
import { Request, Response } from  "express";
const express = require('express');

// modify the express session module to allow extraction of userId from session in auth.ts
declare module 'express-session' {
  interface SessionData {
    userId?: string
  }
}
const session = require('express-session')
const app = express();
const PORT = 3000;
// takes in json format
app.use(express.json())

// allow to import data from .env file
import dotenv from 'dotenv'; 
dotenv.config();

let sessionConfig = {
  name: 'sessionId',
  secret: process.env.SESSION_SECRET, 
  cookie: {
    maxAge: 1000 * 60 * 5,
    secure: process.env.RENDER ? true : false,
    httpOnly: false,
  },
  resave: false,
  saveUninitialized: false,
}

app.use(session(sessionConfig))

const authRouter = require('./routes/auth')
app.use(authRouter)


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to my app!')
})
