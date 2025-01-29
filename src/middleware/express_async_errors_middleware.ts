import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ApiError } from "Src/helpers/Errors/ApiError";

export const express_async_errors_middleware: ErrorRequestHandler = (
  error: Error & ApiError,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.log(error);

  const statusCode = error.statusCode ?? 500;
  const message = error.message;
  const data = error.data;

  if (response.headersSent) return next(error);

  response.status(statusCode).json({
    message,
    data,
  });
};
