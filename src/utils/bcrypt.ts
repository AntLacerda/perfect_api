import bcrypt from "bcrypt";
import { AppError } from "@src/errors/AppError";

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;

export const createHashPassword = async (password: string): Promise<string> => {
    try {
        return await bcrypt.hash(password, SALT_ROUNDS);
    } catch (error) {
        throw new AppError("Error creating hash password", 500, "HASH_CREATION_ERROR");
    }
}

export const compareHashWithPassword = async (password: string, hashPassword: string): Promise<boolean> => {
    try {
        return await bcrypt.compare(password, hashPassword);
    } catch (error) {
        throw new AppError("Error comparing hash with password", 500, "HASH_COMPARISON_ERROR");
        
    }
}