import bcrypt from "bcrypt";
import { env } from "@/config/env";

export const passwordService = {
  hash: async (plainPassword: string): Promise<string> => {
    return await bcrypt.hash(plainPassword, env.BYCRYPT_SALT_ROUNDS);
  },

  compare: async (
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> => {
    return await bcrypt.compare(plainPassword, hashedPassword);
  },
};
