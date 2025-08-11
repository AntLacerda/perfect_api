import { Request, Response } from "express";
import { RegularUserDTO, AdminUserDTO } from "@src/dtos/User";
import { UserService } from "@src/services/User";
import { AppError } from "@src/errors/AppError";

const createAdminUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { name, email, password } = req.body as AdminUserDTO;
        const emailNormalized = email.toLowerCase().trim();

        const result = await UserService.createAdminUser({name, email: emailNormalized, password});

        return res.status(201).json({
            success: true,
            ...result
        });
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ 
                success: false,
                message: error.message 
            });
        }

        console.error("Error creating admin user:", error);
        return res.status(500).json({ 
            success: false,
            message: "Internal server error" 
        });
    }
}