import {
  StockRepository,
  IStockCreateRequest,
} from "../repositories/stockRepository";
import { prisma } from "@/config/prismaClient";
import {
  IStockResponse,
  IStockDetailedResponse,
  IPrimaryStockCreateRequest,
  IDerivedStockCreateRequest,
  IStockUpdateRequest,
  IHttpError,
} from "../models/IStock";

const getStockDetailed = async (
  stockId: number
): Promise<IStockDetailedResponse | null> => {
  return (await prisma.stock.findUnique({
    where: { stock_id: stockId },
    include: {
      productos: true,
      proveedores: true,
      clientes: true,
      stock: true,
    },
  })) as IStockDetailedResponse | null;
};

class StockUserUseCase implements StockRepository {
  async getAllStock(branchId: number): Promise<IStockResponse[]> {
    return (await prisma.stock.findMany({
      where: { sucursal_id: branchId },
    })) as IStockResponse[];
  }

  async getStockById(stockId: number): Promise<IStockDetailedResponse | null> {
    return getStockDetailed(stockId);
  }

  async createStock(
    branchId: number,
    data: IStockCreateRequest
  ): Promise<IStockDetailedResponse> {
    const isDerived =
      "stock_primario" in data &&
      data.stock_primario !== null &&
      data.stock_primario !== undefined;
    let createdStock: IStockResponse;

    console.log("isDerived:", isDerived);

    if (isDerived) {
      const derivedData = data as IDerivedStockCreateRequest;
      const primaryStockId = derivedData.stock_primario;
      const quantityToDerive = derivedData.cantidad;

      const primaryStock = await prisma.stock.findUnique({
        where: { stock_id: primaryStockId },
      });

      if (!primaryStock) {
        const error: IHttpError = {
          name: "NotFound",
          status: 404,
          message: `Stock primario ID ${primaryStockId} no encontrado.`,
        };
        throw error;
      }

      const derivedTotal = await prisma.stock.aggregate({
        _sum: { cantidad: true },
        where: { stock_primario: primaryStockId },
      });

      const totalDerivedWeight = derivedTotal._sum.cantidad || 0;

      const availableWeight = primaryStock.cantidad - totalDerivedWeight;

      console.log("Peso disponible en stock primario:", availableWeight);

      if (quantityToDerive > availableWeight) {
        const error: IHttpError = {
          name: "Conflict",
          status: 409,
          message: `La cantidad (${quantityToDerive}kg) excede el peso disponible (${availableWeight}kg) del stock primario ID ${primaryStockId}.`,
        };
        throw error;
      }

      createdStock = await prisma.stock.create({
        data: {
          producto_id: derivedData.producto_id,
          cantidad: derivedData.cantidad,
          costo: derivedData.costo,
          sucursal_id: branchId,
          stock_primario: primaryStockId,
          created_at: new Date(),
        },
      });

      console.log("Stock derivado creado:", createdStock);
    } else {
      console.log("Creando stock primario...");
      const primaryData = data as IPrimaryStockCreateRequest;

      const providerExists = await prisma.proveedores.findUnique({
        where: { proveedor_id: primaryData.proveedor_origen_id },
      });

      if (!providerExists) {
        const error: IHttpError = {
          name: "NotFound",
          status: 404,
          message: `El Proveedor ID ${primaryData.proveedor_origen_id} no existe.`,
        };
        throw error;
      }

      console.log("Proveedor encontrado:", providerExists);

      createdStock = await prisma.stock.create({
        data: {
          producto_id: primaryData.producto_id,
          cantidad: primaryData.cantidad,
          costo: primaryData.costo,
          sucursal_id: branchId,
          proveedor_origen_id: primaryData.proveedor_origen_id,
          cliente_origen_id: null,
          tipo_origen: primaryData.tipo_origen,
          created_at: new Date(),
        },
      });
    }

    return getStockDetailed(
      createdStock.stock_id
    ) as Promise<IStockDetailedResponse>;
  }

  async updateStock(
    stockId: number,
    data: IStockUpdateRequest
  ): Promise<IStockResponse> {
    return (await prisma.stock.update({
      where: { stock_id: stockId },
      data: data,
    })) as IStockResponse;
  }

  async deleteStock(stockId: number): Promise<void> {
    const hasDerived = await prisma.stock.count({
      where: { stock_primario: stockId },
    });

    if (hasDerived > 0) {
      const error: IHttpError = {
        name: "Conflict",
        status: 409,
        message:
          "No se puede eliminar este stock primario, tiene productos derivados registrados.",
      };
      throw error;
    }

    await prisma.stock.delete({ where: { stock_id: stockId } });
  }
}

export const stockUserUseCase = new StockUserUseCase();
