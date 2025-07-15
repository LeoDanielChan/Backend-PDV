import dotenv from "dotenv";

dotenv.config();

export const env = {
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET!,
    BYCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS!),
    JWT_EXPIRATION: process.env.JWT_EXPIRATION!,
}