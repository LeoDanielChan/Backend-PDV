import dotenv from "dotenv";

dotenv.config();

export const env = {
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET as string,
    BYCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS || "10"),
    JWT_EXPIRATION: process.env.JWT_EXPIRATION || "1h",
};