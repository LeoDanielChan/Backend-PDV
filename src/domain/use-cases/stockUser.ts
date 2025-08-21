import { StockRepository } from "../repositories/stockRepository";
import { prisma } from "@/config/prismaClient";

class StockUserUseCase implements StockRepository {
  async getAllStock(branchId: number): Promise<any[]> {
    return await prisma.stock.findMany({ where: { sucursal_id: branchId } });
  }
  async getStockById(stockId: number): Promise<any> {
    return await prisma.stock.findUnique({ where: { stock_id: stockId } });
  }
  async createStock(branchId: number, data: any): Promise<any> {
    return await prisma.stock.create({ data: { ...data, sucursal_id: branchId } });
  }
  async updateStock(stockId: number, data: any): Promise<any> {
    return await prisma.stock.update({ where: { stock_id: stockId }, data });
  }
  async deleteStock(stockId: number): Promise<void> {
    await prisma.stock.delete({ where: { stock_id: stockId } });
  }
}

export const stockUserUseCase = new StockUserUseCase();
