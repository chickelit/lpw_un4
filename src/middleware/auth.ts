import { NextFunction, Request, Response } from "express";
import { dataSource } from "Src/database/data-source";
import { User } from "Src/database/entities/User.entity";
import { UnauthorizedAccessError } from "Src/helpers/Errors/UnauthorizedAccessError";
import { Jwt } from "Src/Services/Jwt";

export const auth = () => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const authorization = request.headers["authorization"];
    const token = authorization?.split(" ")[1];

    if (!token) throw new UnauthorizedAccessError();

    const data = Jwt.verify(token);

    if (!data) throw new UnauthorizedAccessError();

    const user = await dataSource.getRepository(User).findOne({
      where: {
        id: data.id,
      },
    });

    if (!user) throw new UnauthorizedAccessError();

    request.auth = {
      user: user
    };

    next();
  };
};
