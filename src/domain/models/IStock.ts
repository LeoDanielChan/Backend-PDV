import {
  stock,
  productos,
  proveedores,
  clientes,
} from "@/infrastructure/database/generated/prisma";
import * as z from "zod";
import {
  PrimaryStockCreateValidator,
  DerivedStockCreateValidator,
  StockUpdateValidator,
} from "@/interfaces/validators/stock.validator";

export type IPrimaryStockCreateRequest = z.infer<
  typeof PrimaryStockCreateValidator
>;

export type IDerivedStockCreateRequest = z.infer<
  typeof DerivedStockCreateValidator
>;

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
