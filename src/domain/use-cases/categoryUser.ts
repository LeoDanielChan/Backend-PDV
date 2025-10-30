import { prisma } from "@/config/prismaClient";
import {
  ICategoryResponse,
  ICreateCategoryRequest,
  IHttpError,
  IUpdateCategoryRequest,
} from "@/domain/models/ICategory";
import { CategoryRepository } from "../repositories/categoryRepository";

export class CategoryUser implements CategoryRepository {
  async createCategory(
    data: ICreateCategoryRequest
  ): Promise<ICategoryResponse> {
    return prisma.categorias.create({ data }) as Promise<ICategoryResponse>;
  }

  async updateCategory(
    data: IUpdateCategoryRequest
  ): Promise<ICategoryResponse> {
    const { categoria_id, ...rest } = data;
    const exists = await prisma.categorias.findUnique({
      where: { categoria_id },
    });

    if (!exists) {
      const error: IHttpError = {
        name: "NotFound",
        status: 404,
        message: "Categoría no encontrada para actualizar",
      };
      throw error;
    }

    try {
      return prisma.categorias.update({
        where: { categoria_id },
        data: rest,
      }) as Promise<ICategoryResponse>;
    } catch (error) {
      const httpError: IHttpError = {
        name: "InternalError",
        status: 500,
        message: "Error al actualizar la categoría",
      };
      throw httpError;
    }
  }

  async listCategoriesBySucursal(
    sucursal_id: number
  ): Promise<ICategoryResponse[]> {
    return prisma.categorias.findMany({
      where: { sucursal_id: sucursal_id },
    }) as Promise<ICategoryResponse[]>;
  }
}
