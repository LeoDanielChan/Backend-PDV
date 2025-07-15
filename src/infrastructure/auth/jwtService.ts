import jwt from "jsonwebtoken";
import { env } from "@/config/env";

interface JwtPayload {
  userId: string;
  role?: string;
}

const JWT_SECRET = env.JWT_SECRET;
const JWT_EXPIRES_IN = "1h";

export const jwtService = {
  sign: (payload: JwtPayload): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  },

  verify: (token: string): JwtPayload => {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  },
};
