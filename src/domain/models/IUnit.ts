import { unidad_venta } from "@/infrastructure/database/generated/prisma";
import * as z from "zod";
import {
  UnitCreateValidator,
  UnitUpdateValidator,
} from "@/interfaces/validators/unit.validator";

export type IUnitCreateRequest = z.infer<typeof UnitCreateValidator>;

export type IUnitUpdateRequest = z.infer<typeof UnitUpdateValidator>;

export interface IUnitResponse extends unidad_venta {}

export interface IHttpError extends Error {
  status: number;
  message: string;
  name: string;
}

export interface IZodErrorResponse {
  message: string;
  errors: any[];
}
