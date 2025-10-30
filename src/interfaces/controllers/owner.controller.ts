import { Request, Response } from "express";
import { OwnerUser } from "@/domain/use-cases/ownerUser";
import { AuthRequest } from "../middleware/authMiddleware";
import {
  IFranchiseRequest,
  IHttpError,
  IOwnerRes,
  IZodErrorResponse,
} from "@/domain/models/IOwner";
import { FranchiseCreateValidator } from "../validators/owner.validator";
import { ZodError } from "zod";

const ownerUser = new OwnerUser();

export const getFranchises = async (
  req: Request,
  res: Response<IOwnerRes[] | { message: string }>
): Promise<any> => {
  try {
    const dataReq = req as AuthRequest;
    const userId = dataReq.user.id;

    const franchises = await ownerUser.getUserFranchises(userId);
    return res.status(200).json(franchises);
  } catch (error: any) {
    const httpError = error as IHttpError;
    if (httpError.status && httpError.message) {
      return res.status(httpError.status).json({ message: httpError.message });
    }

    console.error("Error al obtener franquicias:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor al obtener franquicias" });
  }
};

export const createFranchise = async (
  req: Request<{}, {}, IFranchiseRequest>,
  res: Response<IOwnerRes | { message: string } | IZodErrorResponse>
): Promise<any> => {
  try {
    const franchiseData: IFranchiseRequest = FranchiseCreateValidator.parse(
      req.body
    );

    const dataReq = req as AuthRequest;
    const userId = dataReq.user.id;

    const newFranchise = await ownerUser.createFranchise(userId, franchiseData);

    return res.status(201).json(newFranchise);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Campos inválidos",
        errors: error.issues,
      });
    }
    
    const httpError = error as IHttpError;
    if (httpError.status && httpError.message) {
      return res.status(httpError.status).json({ message: httpError.message });
    }

    console.error("Error al crear franquicia:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor al crear franquicia" });
  }
};
