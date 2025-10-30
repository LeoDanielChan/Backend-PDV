import { Request, Response } from "express";
import { productUserUseCase } from "@/domain/use-cases/productUser";
import {
  IProductResponse,
  IProductDetailedResponse,
  IProductCreateRequest,
  IProductUpdateRequest,
  IHttpError,
  IZodErrorResponse,
} from "@/domain/models/IProduct";
import { AuthRequest } from "../middleware/authMiddleware";
import {
  ProductCreateValidator,
  ProductUpdateValidator,
} from "../validators/product.validator";
import { ZodError } from "zod";

type ProductErrorResponse = { message: string } | IZodErrorResponse;

export const getAllProducts = async (
  req: Request<{ branchId: string }>,
  res: Response<IProductResponse[] | ProductErrorResponse>
): Promise<any> => {
  try {
    const branchId = Number(req.params.branchId);
    if (isNaN(branchId)) {
      return res.status(400).json({ message: "ID de sucursal inválido" });
    }
    const products = await productUserUseCase.getAllProducts(branchId);
    return res.status(200).json(products);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor al obtener productos" });
  }
};

export const getProductById = async (
  req: Request<{ id: string }>,
  res: Response<IProductDetailedResponse | ProductErrorResponse>
): Promise<any> => {
  try {
    const productId = Number(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({ message: "ID de producto inválido" });
    }

    const product = await productUserUseCase.getProductById(productId);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    return res.status(200).json(product);
  } catch (error) {
    console.error("Error al obtener producto:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor al obtener producto" });
  }
};

export const createProduct = async (
  req: Request<{ branchId: string }, {}, IProductCreateRequest>,
  res: Response<IProductDetailedResponse | ProductErrorResponse>
): Promise<any> => {
  try {
    const data: IProductCreateRequest = ProductCreateValidator.parse(req.body);

    const branchId = Number(req.params.branchId);
    if (isNaN(branchId)) {
      return res.status(400).json({ message: "ID de sucursal inválido" });
    }

    const product = await productUserUseCase.createProduct(branchId, data);

    return res.status(201).json(product);
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

    console.error("Error al crear producto:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor al crear producto" });
  }
};

export const updateProduct = async (
  req: Request<{ id: string }, {}, IProductUpdateRequest>,
  res: Response<IProductResponse | ProductErrorResponse>
): Promise<any> => {
  try {
    const productId = Number(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({ message: "ID de producto inválido" });
    }

    const data: IProductUpdateRequest = ProductUpdateValidator.parse(req.body);
    const product = await productUserUseCase.updateProduct(productId, data);
    return res.status(200).json(product);
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

    console.error("Error al actualizar producto:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor al actualizar producto" });
  }
};

export const deleteProduct = async (
  req: Request<{ id: string }>,
  res: Response<void | ProductErrorResponse>
): Promise<any> => {
  try {
    const productId = Number(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({ message: "ID de producto inválido" });
    }

    await productUserUseCase.deleteProduct(productId);
    return res.status(204).send();
  } catch (error) {
    const httpError = error as IHttpError;
    if (httpError.status && httpError.message) {
      return res.status(httpError.status).json({ message: httpError.message });
    }

    console.error("Error al eliminar producto:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor al eliminar producto" });
  }
};
