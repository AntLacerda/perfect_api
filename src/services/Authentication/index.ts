import { PrismaClient } from "@prisma/client";
import { sign } from "jsonwebtoken";
import { compareHashWithPassword, createHashPassword } from "@src/utils/bcrypt";
import { RegularUserDTO } from "@src/dtos/User";
import User from "@src/models/User";
import Permission from "@src/models/Permission";
import { AppError } from "@src/errors/AppError";

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