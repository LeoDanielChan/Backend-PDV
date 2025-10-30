import { ProductRepository } from "../repositories/productRepository";
import { prisma } from "@/config/prismaClient";
import {
  IProductResponse,
  IProductDetailedResponse,
  IProductCreateRequest,
  IProductUpdateRequest,
  IHttpError,
} from "../models/IProduct";

class ProductUserUseCase implements ProductRepository {
  async getAllProducts(branchId: number): Promise<IProductResponse[]> {
    return (await prisma.productos.findMany({
      where: { sucursal_id: branchId },
    })) as IProductResponse[];
  }

  async getProductById(
    productId: number
  ): Promise<IProductDetailedResponse | null> {
    return (await prisma.productos.findUnique({
      where: { producto_id: productId },
      include: {
        presentacion_producto: {
          include: {
            unidad_venta: true,
          },
        },
        categorias: true,
      },
    })) as IProductDetailedResponse | null;
  }

  async createProduct(
    branchId: number,
    data: IProductCreateRequest
  ): Promise<IProductDetailedResponse> {
    const { presentaciones, ...productData } = data;

    try {
      const newProduct = (await prisma.productos.create({
        data: {
          ...productData,
          sucursal_id: branchId,
          created_at: new Date(),
          presentacion_producto: {
            createMany: {
              data: presentaciones.map((p) => ({
                unidad_id: p.unidad_id,
                precio: p.precio,
                cantidad_equivalente: p.cantidad_equivalente,
                descripcion: p.descripcion,
              })),
            },
          },
        },
        include: {
          presentacion_producto: {
            include: {
              unidad_venta: true,
            },
          },
          categorias: true,
        },
      })) as IProductDetailedResponse;

      return newProduct;
    } catch (error) {
      console.error("Error detallado al crear producto:", error);
      const httpError: IHttpError = {
        name: "BadRequest",
        status: 400,
        message: "Error de datos: ID de Categoría o Unidad de Venta inválido.",
      };
      throw httpError;
    }
  }

  async updateProduct(
    productId: number,
    data: IProductUpdateRequest
  ): Promise<IProductResponse> {
    const { presentaciones, ...productData } = data;

    const updatePayload: any = {
      ...productData,
      update_at: new Date(),
    };

    return (await prisma.productos.update({
      where: { producto_id: productId },
      data: updatePayload,
    })) as IProductResponse;
  }

  async deleteProduct(productId: number): Promise<void> {
    try {
      await prisma.productos.delete({ where: { producto_id: productId } });
    } catch (error) {
      const httpError: IHttpError = {
        name: "NotFound",
        status: 404,
        message: "Producto no encontrado para eliminar.",
      };
      throw httpError;
    }
  }
}

export const productUserUseCase = new ProductUserUseCase();
