import bcrypt from "bcrypt";
import { env } from "@/config/env";

export const passwordService = {
  hash: async (plainPassword: string): Promise<string> => {
    const salt = parseInt(env.BYCRYPT_SALT_ROUNDS, 10);
    if (isNaN(salt)) {
      throw new Error("BYCRYPT_SALT_ROUNDS no es un número válido.");
    }
    return await bcrypt.hash(plainPassword, salt);
  },

  compare: async (
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> => {
    return await bcrypt.compare(plainPassword, hashedPassword);
  },
};
