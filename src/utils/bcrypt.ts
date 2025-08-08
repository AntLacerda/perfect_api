import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const createHashPassword = async (password: string): Promise<string> => {
    const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);

    return hashPassword;
}

export const compareHashWithPassword = async (password: string, hashPassword: string): Promise<boolean> => {
    const isValidPassword = await bcrypt.compare(password, hashPassword);

    return isValidPassword;
}