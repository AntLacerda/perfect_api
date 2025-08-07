import { AppError } from "./AppError";

export class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized access"){
        super(message, 401, "UNAUTHORIZED");
    }
}