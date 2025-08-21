import jwt from "jsonwebtoken";
import { env } from "@/config/env";

interface JwtPayload {
  userId: number;
  tipo_usuario?: number;
}


export const jwtService = {
  sign: (payload: JwtPayload): string => {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRATION} as jwt.SignOptions);
  },

  verify: (token: string): JwtPayload => {
    return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  },
};
