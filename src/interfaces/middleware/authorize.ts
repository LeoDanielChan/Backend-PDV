import { Response, NextFunction, Request, RequestHandler } from "express";
import { AuthRequest } from "./authMiddleware";

export const authorize = (tipos_usuarios: number[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    
    if (!authReq.user || !authReq.user.tipo_usuario) {
      res.status(403).json({ message: "No autenticado" });
      return;
    }

    if (!tipos_usuarios.includes(authReq.user.tipo_usuario)) {
      res.status(403).json({ message: "No autorizado" });
      return;
    }

    next();
  };
};
