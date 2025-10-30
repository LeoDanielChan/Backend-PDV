// src/interfaces/controllers/supplier.controller.ts
import { Request, Response } from "express";
import { supplierUserUseCase } from "@/domain/use-cases/supplierUser";
import { ZodError } from "zod";
import {
  ISupplierCreateRequest,
  ISupplierUpdateRequest,
  ISupplierResponse,
  IHttpError,
  IZodErrorResponse,
} from "@/domain/models/ISupplier";
import {
  SupplierCreateValidator,
  SupplierUpdateValidator,
} from "../validators/supplier.validator";
import { AuthRequest } from "../middleware/authMiddleware";

type SupplierErrorResponse = { message: string } | IZodErrorResponse;

export const getAllSuppliers = async (
  req: Request<{ branchId: string }>,
  res: Response<ISupplierResponse[] | SupplierErrorResponse>
): Promise<any> => {
  try {
    const branchId = Number(req.params.branchId);
    if (isNaN(branchId))
      return res.status(400).json({ message: "ID de sucursal inválido" });

    const suppliers = await supplierUserUseCase.getAllSuppliers(branchId);
    return res.status(200).json(suppliers);
  } catch (error) {
    console.error("Error al obtener proveedores:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor al obtener proveedores" });
  }
};

export const getSupplierById = async (
  req: Request<{ id: string }>,
  res: Response<ISupplierResponse | SupplierErrorResponse>
): Promise<any> => {
  try {
    const supplierId = Number(req.params.id);
    if (isNaN(supplierId))
      return res.status(400).json({ message: "ID de proveedor inválido" });

    const supplier = await supplierUserUseCase.getSupplierById(supplierId);
    if (!supplier)
      return res.status(404).json({ message: "Proveedor no encontrado" });

    return res.status(200).json(supplier);
  } catch (error) {
    console.error("Error al obtener proveedor:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor al obtener proveedor" });
  }
};

export const createSupplier = async (
  req: Request<{ branchId: string }, {}, ISupplierCreateRequest>,
  res: Response<ISupplierResponse | SupplierErrorResponse>
): Promise<any> => {
  try {
    const branchId = Number(req.params.branchId);
    if (isNaN(branchId))
      return res.status(400).json({ message: "ID de sucursal inválido" });

    const data: ISupplierCreateRequest = SupplierCreateValidator.parse({
      ...req.body,
      sucursal_id: branchId,
    });

    const supplier = await supplierUserUseCase.createSupplier(data);
    return res.status(201).json(supplier);
  } catch (error) {
    if (error instanceof ZodError) {
      return res
        .status(400)
        .json({ message: "Campos inválidos", errors: error.issues });
    }
    const httpError = error as IHttpError;
    if (httpError.status && httpError.message) {
      return res.status(httpError.status).json({ message: httpError.message });
    }
    console.error("Error al crear proveedor:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor al crear proveedor" });
  }
};

export const updateSupplier = async (
  req: Request<{ branchId: string; id: string }, {}, ISupplierUpdateRequest>,
  res: Response<ISupplierResponse | SupplierErrorResponse>
): Promise<any> => {
  try {
    const supplierId = Number(req.params.id);
    if (isNaN(supplierId))
      return res.status(400).json({ message: "ID de proveedor inválido" });

    const data: ISupplierUpdateRequest = SupplierUpdateValidator.parse(
      req.body
    );

    const supplier = await supplierUserUseCase.updateSupplier(supplierId, data);
    return res.status(200).json(supplier);
  } catch (error) {
    if (error instanceof ZodError) {
      return res
        .status(400)
        .json({ message: "Campos inválidos", errors: error.issues });
    }
    const httpError = error as IHttpError;
    if (httpError.status && httpError.message) {
      return res.status(httpError.status).json({ message: httpError.message });
    }
    console.error("Error al actualizar proveedor:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor al actualizar proveedor" });
  }
};

export const deleteSupplier = async (
  req: Request<{ branchId: string; id: string }>,
  res: Response<void | SupplierErrorResponse>
): Promise<any> => {
  try {
    const supplierId = Number(req.params.id);
    if (isNaN(supplierId))
      return res.status(400).json({ message: "ID de proveedor inválido" });

    await supplierUserUseCase.deleteSupplier(supplierId);
    return res.status(204).send();
  } catch (error) {
    const httpError = error as IHttpError;
    if (httpError.status && httpError.message) {
      return res.status(httpError.status).json({ message: httpError.message });
    }
    console.error("Error al eliminar proveedor:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor al eliminar proveedor" });
  }
};
