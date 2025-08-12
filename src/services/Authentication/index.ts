import { PrismaClient } from "@prisma/client";
import { sign } from "jsonwebtoken";
import { compareHashWithPassword, createHashPassword } from "../../utils/bcrypt";
import { RegularUserDTO } from "../../dtos/User";
import User from "../../models/User";
import Permission from "../../models/Permission";
import { AppError } from "../../errors/AppError";

const prisma = new PrismaClient();

const signUp = async (newUser: RegularUserDTO) => {
    const { name, email, password } = newUser;
    const emailNormalized = email.toLowerCase().trim();

    return await prisma.$transaction(async (tx) => {
        const existingUser = await tx.user.findUnique({
            where: {
                email: emailNormalized
            }
        });

        if (existingUser) {
            throw new AppError("User already exists", 409, "USER_ALREADY_EXISTS");
        }

        const userPermission = await tx.permission.findFirst({
            where: {
                role: 'USER',
            }
        });

        if (!userPermission) {
            throw new AppError("User permission not found", 404, "PERMISSION_NOT_FOUND");
        }

        const hashedPassword = await createHashPassword(password);

        const userResponse = await tx.user.create({
            data: {
                name,
                email: emailNormalized,
                password: hashedPassword,
                permission_id: userPermission.id
            },
            select: {
                name: true,
                email: true,
                Permission: {
                    select: {
                        role: true,
                    }
                }
            }
        });

        return userResponse;
    });
}

const login = async (email: string, password: string) => {
    const user = await User.findUnique({
        where: {
            email
        },
        select: {
            id: true,
            password: true,
            Permission: {
                select: {
                    role: true,
                }
            }
        }
    });

    if (!user) {
        throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
    }

    const isPasswordValid = await compareHashWithPassword(password, user.password);
    if (!isPasswordValid) {
        throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
    }

    const jwtSecret = process.env.JWT_SECRET_KEY;
    if (!jwtSecret) {
        throw new Error("JWT secret key is not defined");
    }

    const token = sign(
        {
            id: user.id,
            role: user.Permission.role,
        },
        jwtSecret,
        {
            expiresIn: "1d",
            issuer: "perfect_api",
            audience: "perfect_api_users",
        }
    );

    return {
        userId: user.id,
        token,
    }
}

export const AuthService = {
    signUp,
    login,
};