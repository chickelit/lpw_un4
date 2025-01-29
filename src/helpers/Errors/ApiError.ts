export class ApiError extends Error {
  public readonly statusCode: number = 500;
  public readonly data?: any[] = [];

  /**
   *
   */
  constructor(statusCode: number, message: string = "Erro interno do servidor.", data?: any[]) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
  }
}
