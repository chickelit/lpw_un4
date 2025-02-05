import { ApiError } from "./ApiError";

export class NotFoundError extends ApiError {
  /**
   *
   */
  constructor(message: string = "Não encontrado", errors = [] as any[]) {
    super(404, message, errors);
  }
}
