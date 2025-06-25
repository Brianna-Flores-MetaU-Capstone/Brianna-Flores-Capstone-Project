const express = require('express');
const app = express();
const PORT = 3000;

// import react session for safety
const session = require('express-session')

let sessionConfig = {
  name: 'sessionId',
  secret: 'keep it secret, keep it safe',
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

// get the types for defining req and res
import { Request, Response } from  "express";

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to my app!')
})

