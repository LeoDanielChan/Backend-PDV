import { Request, Response } from "express";
import { OwnerUser } from "@/domain/use-cases/ownerUser";
import { jwtService } from "@/infrastructure/auth/jwtService";

const ownerUser = new OwnerUser();

export const getFranchises = async (req: Request, res: Response): Promise<any> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }
    const token = authHeader.split(" ")[1];
    const payload = jwtService.verify(token);
    console.log(payload);
    if (!payload || payload.tipo_usuario !== 2) {
      return res.status(403).json({ message: "No autorizado" });
    }
    const franchises = await ownerUser.getUserFranchises(payload.userId);
    return res.status(200).json({ franchises });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: "Error al obtener franquicias" });
  }
};

export const createFranchise = async (req: Request, res: Response): Promise<any> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    const token = authHeader.split(" ")[1];
    const payload = jwtService.verify(token);
    console.log(payload);
    if (!payload || payload.tipo_usuario !== 2) {
      return res.status(403).json({ message: "No autorizado" });
    }
    const franchiseData = req.body;
    const newFranchise = await ownerUser.createFranchise(payload.userId, franchiseData);
    return res.status(201).json({ franchise: newFranchise });
  } catch (error: any) {
    return res.status(500).json({ message: "Error al crear franquicia" });
  }
};