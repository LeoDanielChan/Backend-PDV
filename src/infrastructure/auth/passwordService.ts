import bcrypt from "bcrypt";
import { env } from "@/config/env";

const SALT_ROUNDS = env.BYCRYPT_SALT_ROUNDS;

export const passwordService = {
  hash: async (plainPassword: string): Promise<string> => {
    return await bcrypt.hash(plainPassword, SALT_ROUNDS);
  },

  compare: async (
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> => {
    return await bcrypt.compare(plainPassword, hashedPassword);
  },
};
