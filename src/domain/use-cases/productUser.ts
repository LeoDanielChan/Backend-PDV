import { ProductRepository } from "../repositories/productRepository";
import { prisma } from "@/config/prismaClient";

class ProductUserUseCase implements ProductRepository {
  async getAllProducts(branchId: number): Promise<any[]> {
    return await prisma.productos.findMany({ where: { sucursal_id: branchId } });
  }
  async getProductById(productId: number): Promise<any> {
    return await prisma.productos.findUnique({ where: { producto_id: productId } });
  }
  async createProduct(branchId: number, data: any): Promise<any> {
    return await prisma.productos.create({ data: { ...data, sucursal_id: branchId } });
  }
  async updateProduct(productId: number, data: any): Promise<any> {
    return await prisma.productos.update({ where: { producto_id: productId }, data });
  }
  async deleteProduct(productId: number): Promise<void> {
    await prisma.productos.delete({ where: { producto_id: productId } });
  }
}

export const productUserUseCase = new ProductUserUseCase();
