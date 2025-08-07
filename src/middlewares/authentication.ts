import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { TokenPayLoad } from "../dtos/TokenPayLoad";
import { AppError } from "../errors/AppError";

export const authentication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { authorization } = req.headers;

    if(!authorization || !authorization.startsWith("Bearer ")) {
        throw new AppError("Token is missing or invalid", 401, "TOKEN_ERROR");
    }

    const token = authorization.split(" ")[1];
    const secretKey = process.env.JWT_SECRET_KEY || "secret_key";

    try {
        const decoded = verify(token, secretKey);
        const { id } = decoded as TokenPayLoad;

        req.userId = id;

        next();
    } catch (error) {
        throw new AppError("Token is missing or invalid", 401, "TOKEN_ERROR");
    }
}