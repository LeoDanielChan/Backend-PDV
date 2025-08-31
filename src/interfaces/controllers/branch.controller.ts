import { Request, Response, RequestHandler } from "express";
import { branchUserUseCase } from "@/domain/use-cases/branchUser";
import { BranchCreateValidator } from "../validators/branch.validator";
import { ZodError } from "zod";
import { AuthRequest } from "../middleware/authMiddleware";

export const getAllBranches = async (req: Request, res: Response): Promise<any> => {
  const dataReq = req as AuthRequest;
  const userId = dataReq.user.id;
  const branches = await branchUserUseCase.getAllBranches(userId);
  return res.status(200).json({ branches });
};

export const getBranchById = async (req: Request, res: Response): Promise<any> => {
  const data = req as AuthRequest;
  const id = req.params.id;
  const branch = await branchUserUseCase.getBranchById(data.user.id, Number(id));
  if (!branch) return res.status(404).json({ message: "Sucursal no encontrada" });
  return res.status(200).json( branch );
};

export const createBranch = async (req: Request, res: Response): Promise<any> => {
  try {
    const dataReq = req as AuthRequest;
    const userId = dataReq.user.id;
    const parsed = BranchCreateValidator.parse(req.body);
    const data = { ...parsed, id_usuario: userId };
    
    const branch = await branchUserUseCase.createBranch(data);
    return res.status(201).json({ branch });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Campos inválidos",
        errors: error.issues,
      });
    }
    console.error(error);
    return res.status(500).json({ message: "Error al crear sucursal" });
  }
};

export const updateBranch = async (req: Request, res: Response): Promise<any> => {
  const branchId = Number(req.params.id);
  const branch = await branchUserUseCase.updateBranch(branchId, req.body);
  return res.status(200).json({ branch });
};

export const deleteBranch = async (req: Request, res: Response): Promise<any> => {
  const branchId = Number(req.params.id);
  await branchUserUseCase.deleteBranch(branchId);
  return res.status(204).send();
};
