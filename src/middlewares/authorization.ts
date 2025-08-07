import { NextFunction, Request, Response } from "express";
import User from "@src/models/User";
import { AppError } from "../errors/AppError";

const UNAUTHORIZED_MESSAGE = "You don't have permission to access this resource!";

export const authorization = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId } = req;

        const user = await User.findUnique({
            where: {
                id: userId
            }, 
            select: {
                Permission: {
                    select: {
                        role: true,
                    }
                }
            }
        });

        if(user?.Permission.role !== "ADMIN") {
            throw new AppError(UNAUTHORIZED_MESSAGE, 401, "UNAUTHORIZED");
        }
        
        next();
    } catch (error) {
        throw new AppError(UNAUTHORIZED_MESSAGE, 401, "UNAUTHORIZED");
    }
}