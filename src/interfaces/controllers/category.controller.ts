import { Request, Response } from "express";
import {
  CreateCategoryValidator,
  CategoriesByCategoryValidator,
  UpdateCategoryValidator,
  ListCategoriesBySucursalValidator,
} from "../validators/category.validator";
import { CategoryUser } from "@/domain/use-cases/categoryUser";
import { ZodError } from "zod";
import {
  ICategoryResponse,
  ICategorySuccessResponse,
  ICreateCategoryRequest,
  IHttpError,
  IUpdateCategoryRequest,
  IZodErrorResponse,
} from "@/domain/models/ICategory";
import { prisma } from "@/config/prismaClient";

const categoryUser = new CategoryUser();
type CategoryErrorResponse = { message: string } | IZodErrorResponse;

export const createCategory = async (
  req: Request<{}, {}, ICreateCategoryRequest>,
  res: Response<ICategorySuccessResponse | CategoryErrorResponse>
): Promise<any> => {
  try {
    console.log("Datos recibidos para crear categoría:", req.body);
    const data: ICreateCategoryRequest = CreateCategoryValidator.parse(
      req.body
    );
    const result = await categoryUser.createCategory(data);

    return res.status(201).json({
      message: "Categoría creada exitosamente",
      category: result,
    });
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

    console.error("Error al crear categoría:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor al crear categoría" });
  }
};

export const updateCategory = async (
  req: Request<
    { id: string },
    {},
    Omit<IUpdateCategoryRequest, "categoria_id">
  >,
  res: Response<ICategorySuccessResponse | CategoryErrorResponse>
): Promise<any> => {
  try {
    console.log("Datos recibidos para actualizar categoría:", req.body);
    const categoryId = Number(req.params.id);
    const bodyData = UpdateCategoryValidator.partial().parse(req.body);
    const data: IUpdateCategoryRequest = {
      ...bodyData,
      categoria_id: categoryId,
    };
    const result = await categoryUser.updateCategory(data);

    return res.status(200).json({
      message: "Categoría actualizada exitosamente",
      category: result,
    });
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

    console.error("Error al actualizar categoría:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor al actualizar categoría" });
  }
};

export const listCategoriesBySucursal = async (
  req: Request<{}, {}, { sucursalId: number }>,
  res: Response<ICategoryResponse[] | CategoryErrorResponse>
): Promise<any> => {
  try {
    const { sucursal_id } = ListCategoriesBySucursalValidator.parse(req.body);

    if (isNaN(sucursal_id)) {
      return res
        .status(400)
        .json({ message: "El ID de la sucursal es inválido" });
    }

    const result = await categoryUser.listCategoriesBySucursal(sucursal_id);
    return res.status(200).json(result);
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

    console.error("Error al listar categorías:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor al listar categorías" });
  }
};

export const getCategoryById = async (
  req: Request<{}, {}, { categoryId: number }>,
  res: Response<ICategoryResponse | CategoryErrorResponse>
): Promise<any> => {
  try {
    const parsed = CategoriesByCategoryValidator.parse(req.body);
    const categoryId = parsed.categoryId;

    const category = (await prisma.categorias.findUnique({
      where: { categoria_id: categoryId },
    })) as ICategoryResponse | null;

    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    return res.status(200).json(category);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Campos inválidos",
        errors: error.issues,
      });
    }

    console.error("Error al obtener categoría:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor al obtener categoría" });
  }
};
