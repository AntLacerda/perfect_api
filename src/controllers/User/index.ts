import { Request, Response } from "express";
import { RegularUserDTO, AdminUserDTO, UpdateUserDTO } from "@src/dtos/User";
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

const readAllUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
        const skip = (page - 1) * limit;

        const filters = {
            name: req.query.name ? String(req.query.name).toLowerCase().trim() : undefined,
            role: req.query.role ? String(req.query.role).toLowerCase().trim() : undefined,
        }

        const result = await UserService.readAllUsers(skip, limit, filters);

        return res.status(200).json({
            success: true,
            message: "Users read successfully",
            pagination: {
                total: result.total,
                totalPages: result.totalPages,
                currentPage: page,
                limit: limit,
            },
            data: result.users
        });
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ 
                success: false,
                message: error.message 
            });
        }

        console.error("Error reading all users:", error);
        return res.status(500).json({ 
            success: false,
            message: "Internal server error" 
        });        
    }
}

const readUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ 
                success: false, 
                message: "User ID is required" 
            });
        }

        const result = await UserService.readUser(id);

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

        console.error("Error reading user:", error);
        return res.status(500).json({ 
            success: false,
            message: "Internal server error" 
        });
    }
}

const updateUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const updatedUser = req.body as UpdateUserDTO;

        if (!id) {
            return res.status(400).json({ 
                success: false, 
                message: "User ID is required" 
            });
        }

        const result = await UserService.updateUser(id, updatedUser);

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

        console.error("Error updating user:", error);
        return res.status(500).json({ 
            success: false,
            message: "Internal server error" 
        });
    }
}

const changeSelfPassword = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = req.userId as string;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ 
                success: false, 
                message: "Password is required" 
            });
        }

        const result = await UserService.changeSelfPassword(userId, password);

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

        console.error("Error changing user password:", error);
        return res.status(500).json({ 
            success: false,
            message: "Internal server error" 
        });
    }
}

const updateUserRole = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const { roleId } = req.body;

        if (!id) {
            return res.status(400).json({ 
                success: false, 
                message: "User ID is required" 
            });
        }
        if (!roleId) {
            return res.status(400).json({ 
                success: false, 
                message: "Role ID is required" 
            });
        }

        const result = await UserService.updateUserRole(id, roleId);

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

        console.error("Error updating user role:", error);
        return res.status(500).json({ 
            success: false,
            message: "Internal server error" 
        });
    }
}

