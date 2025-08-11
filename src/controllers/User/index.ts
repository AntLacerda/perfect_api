import { Request, Response } from "express";
import { RegularUserDTO, AdminUserDTO } from "@src/dtos/User";
import { UserService } from "@src/services/User";
import { AppError } from "@src/errors/AppError";

const createAdminUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const newAdminUser = req.body as AdminUserDTO;
        const emailNormalized = newAdminUser.email.toLowerCase().trim();

        const result = await UserService.createAdminUser({...newAdminUser, email: emailNormalized});

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

const createRegularUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const newRegularUser = req.body as RegularUserDTO;
        const emailNormalized = newRegularUser.email.toLowerCase().trim();

        const result = await UserService.createRegularUser({...newRegularUser, email: emailNormalized});

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

        console.error("Error creating regular user:", error);
        return res.status(500).json({ 
            success: false,
            message: "Internal server error" 
        });
    }
}