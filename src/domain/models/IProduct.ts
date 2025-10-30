import {
  productos,
  presentacion_producto,
  unidad_venta,
} from "@/infrastructure/database/generated/prisma";
import * as z from "zod";
import {
  ProductCreateValidator,
  ProductUpdateValidator,
} from "@/interfaces/validators/product.validator";

export type IPresentationCreateData = z.infer<
  typeof ProductCreateValidator
>["presentaciones"][number];

export type IProductCreateRequest = z.infer<typeof ProductCreateValidator>;

export type IProductUpdateRequest = z.infer<typeof ProductUpdateValidator>;

export interface IPresentationDetailed extends presentacion_producto {
  unidad_venta: unidad_venta;
}

export interface IProductDetailedResponse extends productos {
  presentacion_producto: IPresentationDetailed[];
}

export interface IProductResponse extends productos {}

export interface IHttpError extends Error {
  status: number;
  message: string;
  name: string;
}

export interface IZodErrorResponse {
  message: string;
  errors: any[];
}
