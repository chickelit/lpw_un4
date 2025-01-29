import { ApiError } from "./ApiError";

export class ValidationError extends ApiError {
  /**
   *
   */
  constructor(message: string, data = [] as any[]) {
    super(422, message, data);
  }
}
