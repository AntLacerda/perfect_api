import { AuthService } from "../../services/Authentication";
import { Request, Response } from "express";
import { RegularUserDTO } from "../../dtos/User";
import { AppError } from "../../errors/AppError";

const signUp = async (req: Request, res: Response): Promise<Response> => {
    try {
        const newRegularUser = req.body as RegularUserDTO;

        if (!newRegularUser.name || !newRegularUser.email || !newRegularUser.password) {
            return res.status(400).json({ 
                success: false, 
                message: "Name, email, and password are required" 
            });
        }
    
        const result = await AuthService.signUp(newRegularUser);
    
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

        console.error("Error signing up user:", error);
        return res.status(500).json({ 
            success: false,
            message: "Internal server error" 
        });
    }
}

const login = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Email and password are required" 
            });
        }

        const result = await AuthService.login(email, password);

        return res.status(200).json({
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

        console.error("Error logging in user:", error);
        return res.status(500).json({ 
            success: false,
            message: "Internal server error" 
        });
    }
}

export const AuthController = {
    signUp,
    login,
};
