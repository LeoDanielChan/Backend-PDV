import { Request, Response } from "express";
import { stockUserUseCase } from "@/domain/use-cases/stockUser";
import { jwtService } from "@/infrastructure/auth/jwtService";

export const getAllStock = async (req: Request, res: Response): Promise<any> => {
  const branchId = Number(req.params.branchId);
  const stock = await stockUserUseCase.getAllStock(branchId);
  return res.status(200).json({ stock });
};

export const getStockById = async (req: Request, res: Response): Promise<any> => {
  const stockId = Number(req.params.id);
  const stockItem = await stockUserUseCase.getStockById(stockId);
  if (!stockItem) return res.status(404).json({ message: "Stock no encontrado" });
  return res.status(200).json({ stock: stockItem });
};

export const createStock = async (req: Request, res: Response): Promise<any> => {
  const branchId = Number(req.params.branchId);
  const stockItem = await stockUserUseCase.createStock(branchId, req.body);
  return res.status(201).json({ stock: stockItem });
};

export const updateStock = async (req: Request, res: Response): Promise<any> => {
  const stockId = Number(req.params.id);
  const stockItem = await stockUserUseCase.updateStock(stockId, req.body);
  return res.status(200).json({ stock: stockItem });
};

export const deleteStock = async (req: Request, res: Response): Promise<any> => {
  const stockId = Number(req.params.id);
  await stockUserUseCase.deleteStock(stockId);
  return res.status(204).send();
};
