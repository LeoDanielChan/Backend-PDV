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
  IStockDetailed,
  IStockProcessRequest,
  IStockProcessResponse,
  IStockEntryRequest,
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
      unidad_venta: true,
    },
  })) as IStockDetailedResponse | null;
};

class StockUserUseCase implements StockRepository {

  // --- A. Crear Entrada (Compra) ---
  async createEntry(data: IStockEntryRequest): Promise<IStockDetailed> {
    
    // Crear el registro
    const newStock = await prisma.stock.create({
      data: {
        producto_id: data.producto_id,
        sucursal_id: data.sucursal_id,
        unidad_id: data.unidad_id, // ¡Importante!
        cantidad: data.cantidad,
        cantidad_actual: data.cantidad, // Al inicio, todo está disponible
        costo: data.costo,
        proveedor_origen_id: data.proveedor_origen_id ?? null,
        cliente_origen_id: data.cliente_origen_id ?? null,
        tipo_origen: data.tipo_origen,
        estado: "ACTIVO",
        created_at: new Date(),
      },
      include: {
        productos: true,
        unidad_venta: true,
      },
    });

    return newStock as unknown as IStockDetailed;
  }

  // --- B. Procesar Despiece (Lógica Compleja) ---
  async processMeat(data: IStockProcessRequest): Promise<IStockProcessResponse> {
    return await prisma.$transaction(async (tx) => {
      // 1. Obtener Stock Padre
      const padre = await tx.stock.findUnique({
        where: { stock_id: data.stock_padre_id },
      });

      if (!padre) throw { status: 404, message: "Stock padre no encontrado" };
      
      // Validaciones de negocio
      if (padre.cantidad_actual <= 0 || padre.estado !== "ACTIVO") {
        throw { status: 409, message: "El stock seleccionado ya fue procesado o está agotado" };
      }

      // 2. Calcular Peso Total de Salida
      const pesoTotalSalida = data.cortes.reduce((sum, corte) => sum + corte.peso, 0);

      if (pesoTotalSalida > padre.cantidad_actual) {
        throw { 
          status: 409, 
          message: `El peso de los cortes (${pesoTotalSalida}) excede el disponible (${padre.cantidad_actual})` 
        };
      }

      // 3. Actualizar al Padre
      // Calculamos cuánto sobra. Si finalizar_padre es true, asumimos que el sobrante es merma y cerramos el stock.
      const sobrante = padre.cantidad_actual - pesoTotalSalida;
      const nuevoEstado = (sobrante === 0 || data.finalizar_padre) ? "PROCESADO" : "ACTIVO";
      const nuevaCantidadActual = (data.finalizar_padre) ? 0 : sobrante;

      await tx.stock.update({
        where: { stock_id: padre.stock_id },
        data: {
          cantidad_actual: nuevaCantidadActual,
          estado: nuevoEstado,
        },
      });

      // 4. Crear los Hijos (Cortes)
      const nuevosStocks = [];
      
      for (const corte of data.cortes) {
        // Cálculo de costo proporcional:
        // (Peso del corte / Peso Total Salida) * (Costo proporcional del padre usado)
        // Simplificación: Asignamos costo basado en el % de peso que representa del total procesado
        const fraccionCosto = (corte.peso / pesoTotalSalida); 
        // Nota: Esto es lineal. En carnicería real un corte vale más que otro, 
        // pero para empezar, prorratear por peso es correcto contablemente.
        const costoAsignado = (padre.costo * (pesoTotalSalida / padre.cantidad)) * fraccionCosto;

        const nuevo = await tx.stock.create({
          data: {
            sucursal_id: padre.sucursal_id,
            producto_id: corte.producto_id,
            unidad_id: corte.unidad_id,
            cantidad: corte.peso,
            cantidad_actual: corte.peso, // El hijo nace lleno
            costo: costoAsignado,
            stock_primario: padre.stock_id, // Trazabilidad
            tipo_origen: "DESPIECE",
            estado: "ACTIVO",
            created_at: new Date(),
          },
        });
        nuevosStocks.push(nuevo);
      }

      return {
        mensaje: "Despiece completado correctamente",
        padre_procesado: {
          stock_id: padre.stock_id,
          peso_restante: nuevaCantidadActual,
          estado: nuevoEstado
        },
        merma: (data.finalizar_padre && sobrante > 0) ? sobrante : 0,
        productos_generados: nuevosStocks,
      };
    });
  }

  // --- C. Lecturas ---
  async getAllByBranch(branchId: number): Promise<IStockDetailed[]> {
    return await prisma.stock.findMany({
      where: { sucursal_id: branchId, estado: "ACTIVO" }, // Solo mostramos lo disponible
      include: { productos: true, unidad_venta: true },
      orderBy: { created_at: 'desc' }
    }) as unknown as IStockDetailed[];
  }

  async getById(stockId: number): Promise<IStockDetailed | null> {
    return await prisma.stock.findUnique({
      where: { stock_id: stockId },
      include: { productos: true, unidad_venta: true, proveedores: true, clientes: true },
    }) as unknown as IStockDetailed | null;
  }

//  async getAllStock(branchId: number): Promise<IStockResponse[]> {
//    return (await prisma.stock.findMany({
//      where: { sucursal_id: branchId },
//    })) as IStockResponse[];
//  }
//
//  async getStockById(stockId: number): Promise<IStockDetailedResponse | null> {
//    return getStockDetailed(stockId);
//  }
//
//  async createStock(
//    branchId: number,
//    data: IStockCreateRequest
//  ): Promise<IStockDetailedResponse> {
//    const isDerived =
//      "stock_primario" in data &&
//      data.stock_primario !== null &&
//      data.stock_primario !== undefined;
//    let createdStock: IStockResponse;
//
//    console.log("isDerived:", isDerived);
//
//    if (isDerived) {
//      const derivedData = data as IDerivedStockCreateRequest;
//      const primaryStockId = derivedData.stock_primario;
//      const quantityToDerive = derivedData.cantidad;
//
//      const primaryStock = await prisma.stock.findUnique({
//        where: { stock_id: primaryStockId },
//      });
//
//      if (!primaryStock) {
//        const error: IHttpError = {
//          name: "NotFound",
//          status: 404,
//          message: `Stock primario ID ${primaryStockId} no encontrado.`,
//        };
//        throw error;
//      }
//
//      const derivedTotal = await prisma.stock.aggregate({
//        _sum: { cantidad: true },
//        where: { stock_primario: primaryStockId },
//      });
//
//      const totalDerivedWeight = derivedTotal._sum.cantidad || 0;
//
//      const availableWeight = primaryStock.cantidad - totalDerivedWeight;
//
//      console.log("Peso disponible en stock primario:", availableWeight);
//
//      if (quantityToDerive > availableWeight) {
//        const error: IHttpError = {
//          name: "Conflict",
//          status: 409,
//          message: `La cantidad (${quantityToDerive}kg) excede el peso disponible (${availableWeight}kg) del stock primario ID ${primaryStockId}.`,
//        };
//        throw error;
//      }
//
//      createdStock = await prisma.stock.create({
//        data: {
//          producto_id: derivedData.producto_id,
//          cantidad: derivedData.cantidad,
//          costo: derivedData.costo,
//          sucursal_id: branchId,
//          stock_primario: primaryStockId,
//          created_at: new Date(),
//        },
//      });
//
//      console.log("Stock derivado creado:", createdStock);
//    } else {
//      console.log("Creando stock primario...");
//      const primaryData = data as IPrimaryStockCreateRequest;
//
//      const providerExists = await prisma.proveedores.findUnique({
//        where: { proveedor_id: primaryData.proveedor_origen_id },
//      });
//
//      if (!providerExists) {
//        const error: IHttpError = {
//          name: "NotFound",
//          status: 404,
//          message: `El Proveedor ID ${primaryData.proveedor_origen_id} no existe.`,
//        };
//        throw error;
//      }
//
//      console.log("Proveedor encontrado:", providerExists);
//
//      createdStock = await prisma.stock.create({
//        data: {
//          producto_id: primaryData.producto_id,
//          cantidad: primaryData.cantidad,
//          costo: primaryData.costo,
//          sucursal_id: branchId,
//          proveedor_origen_id: primaryData.proveedor_origen_id,
//          cliente_origen_id: null,
//          tipo_origen: primaryData.tipo_origen,
//          created_at: new Date(),
//        },
//      });
//    }
//
//    return getStockDetailed(
//      createdStock.stock_id
//    ) as Promise<IStockDetailedResponse>;
//  }
//
//  async updateStock(
//    stockId: number,
//    data: IStockUpdateRequest
//  ): Promise<IStockResponse> {
//    return (await prisma.stock.update({
//      where: { stock_id: stockId },
//      data: data,
//    })) as IStockResponse;
//  }
//
//  async deleteStock(stockId: number): Promise<void> {
//    const hasDerived = await prisma.stock.count({
//      where: { stock_primario: stockId },
//    });
//
//    if (hasDerived > 0) {
//      const error: IHttpError = {
//        name: "Conflict",
//        status: 409,
//        message:
//          "No se puede eliminar este stock primario, tiene productos derivados registrados.",
//      };
//      throw error;
//    }
//
//    await prisma.stock.delete({ where: { stock_id: stockId } });
//  }
}

export const stockUserUseCase = new StockUserUseCase();
