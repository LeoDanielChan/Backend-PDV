import { Request, Response } from "express";
import { stockUserUseCase } from "@/domain/use-cases/stockUser";
import { ZodError } from "zod";
import {
  IStockResponse,
  IStockDetailedResponse,
  IStockUpdateRequest,
  IHttpError,
  IZodErrorResponse,
} from "@/domain/models/IStock";
import { IStockCreateRequest } from "@/domain/repositories/stockRepository";
import {
  PrimaryStockCreateValidator,
  DerivedStockCreateValidator,
  StockUpdateValidator,
} from "../validators/stock.validator";

type StockErrorResponse = { message: string } | IZodErrorResponse;

export const getAllStock = async (
  req: Request<{ branchId: string }>,
  res: Response<IStockResponse[] | StockErrorResponse>
): Promise<any> => {
  try {
    const branchId = Number(req.params.branchId);
    if (isNaN(branchId))
      return res.status(400).json({ message: "ID de sucursal inválido" });

    const stock = await stockUserUseCase.getAllStock(branchId);
    return res.status(200).json(stock);
  } catch (error) {
    console.error("Error al obtener stock:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor al obtener stock" });
  }
};

export const getStockById = async (
  req: Request<{ id: string }>,
  res: Response<IStockDetailedResponse | StockErrorResponse>
): Promise<any> => {
  try {
    const stockId = Number(req.params.id);
    if (isNaN(stockId))
      return res.status(400).json({ message: "ID de stock inválido" });

    const stockItem = await stockUserUseCase.getStockById(stockId);

    if (!stockItem) {
      return res.status(404).json({ message: "Stock no encontrado" });
    }
    return res.status(200).json(stockItem);
  } catch (error) {
    console.error("Error al obtener stock:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor al obtener stock" });
  }
};

export const createStock = async (
  req: Request<{ branchId: string }, {}, any>,
  res: Response<IStockDetailedResponse | StockErrorResponse>
): Promise<any> => {
  try {
    const branchId = Number(req.params.branchId);
    if (isNaN(branchId))
      return res.status(400).json({ message: "ID de sucursal inválido" });

    let data: IStockCreateRequest;

    if (req.body.stock_primario) {
      data = DerivedStockCreateValidator.parse(req.body);
    } else {
      data = PrimaryStockCreateValidator.parse(req.body);
    }
    const stockItem = await stockUserUseCase.createStock(branchId, data);

    return res.status(201).json(stockItem);
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

    console.error("Error al crear stock:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor al crear stock" });
  }
};

export const updateStock = async (
  req: Request<{ id: string }, {}, IStockUpdateRequest>,
  res: Response<IStockResponse | StockErrorResponse>
): Promise<any> => {
  try {
    const stockId = Number(req.params.id);
    if (isNaN(stockId))
      return res.status(400).json({ message: "ID de stock inválido" });

    const data: IStockUpdateRequest = StockUpdateValidator.parse(req.body);

    const stockItem = await stockUserUseCase.updateStock(stockId, data);
    return res.status(200).json(stockItem);
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

    console.error("Error al actualizar stock:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor al actualizar stock" });
  }
};

export const deleteStock = async (
  req: Request<{ id: string }>,
  res: Response<void | StockErrorResponse>
): Promise<any> => {
  try {
    const stockId = Number(req.params.id);
    if (isNaN(stockId))
      return res.status(400).json({ message: "ID de stock inválido" });

    await stockUserUseCase.deleteStock(stockId);
    return res.status(204).send();
  } catch (error) {
    const httpError = error as IHttpError;
    if (httpError.status && httpError.message) {
      return res.status(httpError.status).json({ message: httpError.message });
    }
    console.error("Error al eliminar stock:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor al eliminar stock" });
  }
};
