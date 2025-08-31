import { Request, RequestHandler } from "express";
import { jwtService } from "@/infrastructure/auth/jwtService";

export interface AuthRequest extends Request {
  user: {
    id: number;
    tipo_usuario?: number;
  }
}

export const authMiddleware: RequestHandler = (req, res, next): void => {
  const authReq = req as AuthRequest;
  const token = authReq.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Token requerido" });
    return;
  }

  try {
    const payload = jwtService.verify(token);

    if (!payload || !payload.userId) {
      res.status(401).json({ message: "Token inválido" });
      return;
    }

    authReq.user = {
      id: payload.userId,
      tipo_usuario: payload.tipo_usuario
    };

    next();
  } catch (error) {
    console.log("NO paso el middleware de autenticación",error);
    res.status(401).json({ message: "Token inválido" });
  }

}