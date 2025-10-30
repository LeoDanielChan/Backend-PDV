import { Request, Response, RequestHandler } from "express";
import { branchUserUseCase } from "@/domain/use-cases/branchUser";
import {
  BranchCreateValidator,
  BranchUpdateValidator,
} from "../validators/branch.validator";
import { ZodError } from "zod";
import { AuthRequest } from "../middleware/authMiddleware";
import {
  IBranchCreateRequest,
  IBranchDetailedResponse,
  IBranchResponse,
  IBranchUpdateRequest,
  IHttpError,
  IZodErrorResponse,
} from "@/domain/models/IBranch";

type BranchErrorResponse = { message: string } | IZodErrorResponse;

export const getAllBranches = async (
  req: Request,
  res: Response<IBranchResponse[] | BranchErrorResponse>
): Promise<any> => {
  try {
    const dataReq = req as AuthRequest;
    const userId = dataReq.user.id;
    const branches = await branchUserUseCase.getAllBranches(userId);
    return res.status(200).json(branches);
  } catch (error) {
    const httpError = error as IHttpError;
    if (httpError.status && httpError.message) {
      return res.status(httpError.status).json({ message: httpError.message });
    }
    console.error("Error al obtener sucursales:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor al obtener sucursales" });
  }
};

export const getBranchById = async (
  req: Request,
  res: Response<IBranchDetailedResponse | BranchErrorResponse>
): Promise<any> => {
  try {
    const dataReq = req as AuthRequest;
    const branchId = Number(req.params.id);
    const branch = await branchUserUseCase.getBranchById(
      dataReq.user.id,
      branchId
    );
    if (!branch)
      return res.status(404).json({ message: "Sucursal no encontrada" });
    return res.status(200).json(branch);
  } catch (error) {
    const httpError = error as IHttpError;
    if (httpError.status && httpError.message) {
      return res.status(httpError.status).json({ message: httpError.message });
    }
    console.error("Error al obtener sucursal:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor al obtener sucursal" });
  }
};

export const createBranch = async (
  req: Request<{}, {}, IBranchCreateRequest>,
  res: Response<IBranchDetailedResponse | BranchErrorResponse>
): Promise<any> => {
  try {
    const data: IBranchCreateRequest = BranchCreateValidator.parse(req.body);
    const branch = await branchUserUseCase.createBranch(data);

    return res.status(201).json(branch);
  } catch (error: any) {
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

    console.error("Error al crear sucursal:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor al crear sucursal" });
  }
};

export const updateBranch = async (
  req: Request<{ id: string }, {}, IBranchUpdateRequest>,
  res: Response<IBranchResponse | BranchErrorResponse>
): Promise<any> => {
  try {
    const branchId = Number(req.params.id);
    const data: IBranchUpdateRequest = await BranchUpdateValidator.parse(
      req.body
    );
    const branch = await branchUserUseCase.updateBranch(branchId, data);
    return res.status(200).json(branch);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Campos inválidos",
        errors: error.issues,
      });
    }

    // Manejo de errores de negocio
    const httpError = error as IHttpError;
    if (httpError.status && httpError.message) {
      return res.status(httpError.status).json({ message: httpError.message });
    }

    console.error("Error al actualizar sucursal:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor al actualizar sucursal" });
  }
};

export const deleteBranch = async (
  req: Request<{ id: string }>,
  res: Response<void | BranchErrorResponse>
): Promise<any> => {
  try {
    const branchId = Number(req.params.id);
    await branchUserUseCase.deleteBranch(branchId);
    return res.status(204).send();
  } catch (error) {
    const httpError = error as IHttpError;
    if (httpError.status && httpError.message) {
      return res.status(httpError.status).json({ message: httpError.message });
    }

    console.error("Error al eliminar sucursal:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor al eliminar sucursal" });
  }
};
