// src/interfaces/controllers/unit.controller.ts
import { Request, Response } from "express";
import { unitUserUseCase } from "@/domain/use-cases/unitUser";
import { ZodError } from "zod";
import {
  IUnitCreateRequest,
  IUnitUpdateRequest,
  IUnitResponse,
  IHttpError,
  IZodErrorResponse,
} from "@/domain/models/IUnit";
import { UnitCreateValidator } from "../validators/unit.validator";

type UnitErrorResponse = { message: string } | IZodErrorResponse;

export const getAllUnits = async (
  req: Request,
  res: Response<IUnitResponse[] | UnitErrorResponse>
): Promise<any> => {
  try {
    const units = await unitUserUseCase.getAllUnits();
    return res.status(200).json(units);
  } catch (error) {
    console.error("Error al obtener unidades:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor al obtener unidades" });
  }
};

export const getUnitById = async (
  req: Request<{ id: string }>,
  res: Response<IUnitResponse | UnitErrorResponse>
): Promise<any> => {
  try {
    const unitId = Number(req.params.id);
    if (isNaN(unitId)) {
      return res.status(400).json({ message: "ID de unidad inválido" });
    }

    const unit = await unitUserUseCase.getUnitById(unitId);
    if (!unit) {
      return res.status(404).json({ message: "Unidad de venta no encontrada" });
    }

    return res.status(200).json(unit);
  } catch (error) {
    console.error("Error al obtener unidad:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor al obtener unidad" });
  }
};

export const createUnit = async (
  req: Request<{}, {}, IUnitCreateRequest>,
  res: Response<IUnitResponse | UnitErrorResponse>
): Promise<any> => {
  try {
    const data: IUnitCreateRequest = UnitCreateValidator.parse(req.body);
    const unit = await unitUserUseCase.createUnit(data);
    return res.status(201).json(unit);
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
    console.error("Error al crear unidad:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor al crear unidad" });
  }
};

export const updateUnit = async (
  req: Request<{ id: string }, {}, Omit<IUnitUpdateRequest, "unidad_id">>,
  res: Response<IUnitResponse | UnitErrorResponse>
): Promise<any> => {
  try {
    const unitId = Number(req.params.id);
    if (isNaN(unitId)) {
      return res.status(400).json({ message: "ID de unidad inválido" });
    }

    // Validación y combinación de ID
    const bodyData = UnitCreateValidator.partial().parse(req.body);
    const data: IUnitUpdateRequest = { ...bodyData, unidad_id: unitId };

    const unit = await unitUserUseCase.updateUnit(data);
    return res.status(200).json(unit);
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
    console.error("Error al actualizar unidad:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor al actualizar unidad" });
  }
};

export const deleteUnit = async (
  req: Request<{ id: string }>,
  res: Response<void | UnitErrorResponse>
): Promise<any> => {
  try {
    const unitId = Number(req.params.id);
    if (isNaN(unitId)) {
      return res.status(400).json({ message: "ID de unidad inválido" });
    }

    await unitUserUseCase.deleteUnit(unitId);
    return res.status(204).send();
  } catch (error) {
    const httpError = error as IHttpError;
    if (httpError.status && httpError.message) {
      return res.status(httpError.status).json({ message: httpError.message });
    }
    console.error("Error al eliminar unidad:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor al eliminar unidad" });
  }
};
