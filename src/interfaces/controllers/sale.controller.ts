import { Request, Response } from "express";
import { SaleUser } from "@/domain/use-cases/saleUser";
import { CreateSaleValidator, AddPaymentValidator } from "../validators/sale.validator";
import { ZodError } from "zod";

const saleUser = new SaleUser();

export const createSale = async (req: Request, res: Response): Promise<any> => {
  try {
    const data = CreateSaleValidator.parse(req.body);
    const result = await saleUser.createSale(data);
    return res.status(201).json(result);
  } catch (error) {
    handleError(res, error);
  }
};

export const addPayment = async (req: Request, res: Response): Promise<any> => {
  try {
    const data = AddPaymentValidator.parse(req.body);
    const result = await saleUser.addPayment(data);
    return res.status(200).json(result);
  } catch (error) {
    handleError(res, error);
  }
};

export const getSale = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "ID inválido" });

    const result = await saleUser.getById(id);
    if (!result) return res.status(404).json({ message: "Venta no encontrada" });
    
    return res.status(200).json(result);
  } catch (error) {
    handleError(res, error);
  }
};

export const getByBranch = async (req: Request, res: Response): Promise<any> => {
  try {
    const branchId = Number(req.params.branchId);
    if (isNaN(branchId)) return res.status(400).json({ message: "ID Sucursal inválido" });

    const result = await saleUser.getAllByBranch(branchId);
    return res.status(200).json(result);
  } catch (error) {
    handleError(res, error);
  }
};

function handleError(res: Response, error: any) {
  if (error instanceof ZodError) {
    return res.status(400).json({ message: "Datos inválidos", errors: error.issues });
  }
  if (error.status) {
    return res.status(error.status).json({ message: error.message });
  }
  console.error(error);
  return res.status(500).json({ message: "Error interno del servidor" });
}