import {
  stock,
  productos,
  proveedores,
  clientes,
  unidad_venta,
} from "@/infrastructure/database/generated/prisma";
import * as z from "zod";
import {
  PrimaryStockCreateValidator,
  DerivedStockCreateValidator,
  StockUpdateValidator,
  StockEntryValidator,
  StockProcessValidator,
} from "@/interfaces/validators/stock.validator";

export type IPrimaryStockCreateRequest = z.infer<
  typeof PrimaryStockCreateValidator
>;

export type IDerivedStockCreateRequest = z.infer<
  typeof DerivedStockCreateValidator
>;


export type IStockEntryRequest = z.infer<typeof StockEntryValidator>;
export type IStockProcessRequest = z.infer<typeof StockProcessValidator>;

export interface IStockDetailed extends stock {
  productos: productos;
  unidad_venta: unidad_venta; // Incluimos la unidad para ver si son Kilos o Piezas
}

export interface IStockProcessResponse {
  mensaje: string;
  padre_procesado: {
    stock_id: number;
    peso_restante: number;
    estado: string;
  };
  productos_generados: stock[];
  merma: number;
}

export type IStockUpdateRequest = z.infer<typeof StockUpdateValidator>;

export interface IStockDetailedResponse extends stock {
  productos: productos;
  proveedores?: proveedores | null;
  clientes?: clientes | null;
  stock?: IStockResponse | null;
}

export interface IStockResponse extends stock {}

export interface IHttpError extends Error {
  status: number;
  message: string;
  name: string;
}

export interface IZodErrorResponse {
  message: string;
  errors: any[];
}
