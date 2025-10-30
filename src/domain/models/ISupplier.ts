import { proveedores } from "@/infrastructure/database/generated/prisma";
import * as z from "zod";
import {
  SupplierCreateValidator,
  SupplierUpdateValidator,
} from "@/interfaces/validators/supplier.validator";

export type ISupplierCreateRequest = z.infer<typeof SupplierCreateValidator>;

export type ISupplierUpdateRequest = z.infer<typeof SupplierUpdateValidator>;

export interface ISupplierResponse extends proveedores {}

export interface IHttpError extends Error {
  status: number;
  message: string;
  name: string;
}

export interface IZodErrorResponse {
  message: string;
  errors: any[];
}
