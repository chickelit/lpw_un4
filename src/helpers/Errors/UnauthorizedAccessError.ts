import { ApiError } from "./ApiError";

export class UnauthorizedAccessError extends ApiError {
    /**
     *
     */
    constructor(message: string = "Acesso não autorizado.", errors = []) {
        super(401, message, errors);
        
    }
}