const express = require('express');
const app = express();
const PORT = 3000;

// get the types for defining req and res
import { Request, Response } from  "express";

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to my app!')
})
