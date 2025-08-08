import { createHashPassword, compareHashWithPassword } from "@src/utils/bcrypt";
import { AppError } from "@src/errors/AppError";
import { RegularUserDTO } from "@src/dtos/User";
import { prisma } from "@src/database";

const createAdminUser = async (userData: RegularUserDTO) => {
    const { name, email, password } = userData;
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
                    role: "ADMIN",
                }
            });

            if (!userPermission) {
                throw new AppError("Admin permission not found", 404, "PERMISSION_NOT_FOUND");
            }

            const userResponse = await tx.user.create({
                data: {
                    name,
                    email: emailNormalized,
                    password: await createHashPassword(password),
                    Permission: {
                        connect: {
                            id: userPermission.id
                        }
                    }
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

            return {
                message: "Admin user created successfully",
                data: userResponse
            };
    });
}
    
