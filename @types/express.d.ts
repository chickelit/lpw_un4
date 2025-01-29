import "express";
import { User } from "Src/database/entities/User.entity";

declare global {
  namespace Express {
    interface Request {
      auth: {
        user?: User;
        token?: string;
      };
    }
  }
}