import { Request, Response } from "express";
import { productUserUseCase } from "@/domain/use-cases/productUser";
import { jwtService } from "@/infrastructure/auth/jwtService";

export const getAllProducts = async (req: Request, res: Response): Promise<any> => {
  const branchId = Number(req.params.branchId);
  const products = await productUserUseCase.getAllProducts(branchId);
  return res.status(200).json({ products });
};

export const getProductById = async (req: Request, res: Response): Promise<any> => {
  const productId = Number(req.params.id);
  const product = await productUserUseCase.getProductById(productId);
  if (!product) return res.status(404).json({ message: "Producto no encontrado" });
  return res.status(200).json({ product });
};

export const createProduct = async (req: Request, res: Response): Promise<any> => {
  const branchId = Number(req.params.branchId);
  const product = await productUserUseCase.createProduct(branchId, req.body);
  return res.status(201).json({ product });
};

export const updateProduct = async (req: Request, res: Response): Promise<any> => {
  const productId = Number(req.params.id);
  const product = await productUserUseCase.updateProduct(productId, req.body);
  return res.status(200).json({ product });
};

export const deleteProduct = async (req: Request, res: Response): Promise<any> => {
  const productId = Number(req.params.id);
  await productUserUseCase.deleteProduct(productId);
  return res.status(204).send();
};
