import { User } from "Src/database/entities/user.entity";

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