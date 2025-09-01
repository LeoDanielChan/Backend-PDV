import { Request, Response } from "express";
import { OwnerUser } from "@/domain/use-cases/ownerUser";
import { jwtService } from "@/infrastructure/auth/jwtService";
import { AuthRequest } from "../middleware/authMiddleware";

const ownerUser = new OwnerUser();

export const getFranchises = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const dataReq = req as AuthRequest;
    const userId = dataReq.user.id;
    const franchises = await ownerUser.getUserFranchises(userId);
    return res.status(200).json({ franchises });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: "Error al obtener franquicias" });
  }
};

export const createFranchise = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const dataReq = req as AuthRequest;
    const userId = dataReq.user.id;

    const franchiseData = req.body;
    const newFranchise = await ownerUser.createFranchise(
      userId,
      franchiseData
    );
    return res.status(201).json({ franchise: newFranchise });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Error al crear franquicia" });
  }
};
