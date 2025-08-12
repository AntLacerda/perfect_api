import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof AppError) {
        console.log(`[AppError] ${req.method} ${req.url} - ${err.message}`);

        return res.status(err.statusCode).json({
            error: {
                message: err.message,
                code: err.code || "UNKNOWN_ERROR",
                statusCode: err.statusCode
            },
        });
    }

    console.error(`[InternalError] ${req.method} ${req.url} -`, err);

    return res.status(500).json({
        error: {
            message: "Internal server error",
            code: "INTERNAL_SERVER_ERROR",
            statusCode: 500
        },
    });
}