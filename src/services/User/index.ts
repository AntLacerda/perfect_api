import { createHashPassword, compareHashWithPassword } from "@src/utils/bcrypt";
import User from "@src/models/User";
import { AppError } from "@src/errors/AppError";
import { RegularUserDTO, AdminUserDTO, UpdateUserDTO } from "@src/dtos/User";
import { prisma } from "@src/database";

const createAdminUser = async (userData: AdminUserDTO) => {
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

const createRegularUser = async (userData: RegularUserDTO) => {
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
                    role: "REGULAR_USER",
                }
            });

            if (!userPermission) {
                throw new AppError("User permission not found", 404, "PERMISSION_NOT_FOUND");
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
                message: "Regular user created successfully",
                data: userResponse
            };
    });
}

const readAllUsers = async (skip: number, take: number, filters?: { name?: string; role?: string; }) => {
    const where: any = {
        ...(filters?.name && {
            name: {
                contains: filters.name,
                mode: "insensitive"
            }
        }),
        ...(filters?.role && {
            Permission: {
                role: filters.role
            }
        })
    };
    
    const [users, total] = await prisma.$transaction([
        User.findMany({
            skip,
            take,
            where,
            select: {
                name: true,
                email: true,
                Permission: {
                    select: {
                        role: true,
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        }),
        User.count({
            where
        })
    ]);

    const totalPages = Math.ceil(total / take);

    return {
        total,
        totalPages,
        users: users,
    };
}

const readUser = async (userId: string) => {
    const foundedUser = await prisma.user.findUnique({
        where: {
            id: userId
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

    if (!foundedUser) {
        throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    return {
        message: "User found successfully",
        data: foundedUser
    };
}

const updateUser = async (userId: string, userData: UpdateUserDTO) => {
    return await prisma.$transaction(async (tx) => {
        const existingUser = await tx.user.findUnique({
            where: {
                id: userId
            }
        });

        if (!existingUser) {
            throw new AppError("User not found", 404, "USER_NOT_FOUND");
        }

        const emailNormalized = userData.email ? userData.email.toLowerCase().trim() : existingUser.email;
        const nameNormalized = userData.name ? userData.name.trim() : existingUser.name;

        if(emailNormalized) {
            const emailInUse = await tx.user.findUnique({
                where: {
                    email: emailNormalized
                }
            });

            if (emailInUse && emailInUse.id !== userId) {
                throw new AppError("Email already in use", 409, "EMAIL_ALREADY_IN_USE");
            }
        }

        const updateData: any = {
            ...(nameNormalized && { name: nameNormalized }),
            ...(emailNormalized && { email: emailNormalized }),
        }

        const userResponse = await tx.user.update({
            where: {
                id: userId
            },
            data: updateData,
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
            message: "User updated successfully",
            data: userResponse
        };
    })
}

const changeSelfPassword = async (userId: string, password: string) => {
    return await prisma.$transaction(async (tx) => {
        const existingUser = await tx.user.findUnique({
            where: {
                id: userId
            }
        });

        if (!existingUser) {
            throw new AppError("User not found", 404, "USER_NOT_FOUND");
        }

        const hashedPassword = await createHashPassword(password);

        const userResponse = await tx.user.update({
            where: {
                id: userId
            },
            data: {
                password: hashedPassword
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
            message: "User password updated successfully",
            data: userResponse
        };
    });
}

const updateUserRole = async (userId: string, newRoleId: string) => {
    return await prisma.$transaction(async (tx) => {
        const existingUser = await tx.user.findUnique({
            where: {
                id: userId
            }
        });

        if (!existingUser) {
            throw new AppError("User not found", 404, "USER_NOT_FOUND");
        }

        const existingRole = await tx.permission.findUnique({
            where: {
                id: newRoleId
            }
        });

        if (!existingRole) {
            throw new AppError("Role not found", 404, "ROLE_NOT_FOUND");
        }

        const userResponse = await tx.user.update({
            where: {
                id: userId
            },
            data: {
                permission_id: newRoleId,
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

        return ({
            message: "User role updated successfully",
            data: userResponse
        })
    })
}

const removeUser = async (userId: string) => {
    return await prisma.$transaction(async (tx) => {
        const existingUser = await tx.user.findUnique({
            where: {
                id: userId
            }
        });

        if (!existingUser) {
            throw new AppError("User not found", 404, "USER_NOT_FOUND");
        }

        await tx.user.delete({
            where: {
                id: userId
            }
        });

        return {
            message: "User removed successfully"
        };
    });
}

export const UserService = {
    createAdminUser,
    createRegularUser,
    readAllUsers,
    readUser,
    updateUser,
    changeSelfPassword,
    updateUserRole,
    removeUser,
}

    
