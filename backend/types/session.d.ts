import "express-session";
import { Request, Response } from "express";

// define type of express session to include user id
declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

export interface includeSession extends Request {
  session: session.Session & {
    userId: string;
  };
}
