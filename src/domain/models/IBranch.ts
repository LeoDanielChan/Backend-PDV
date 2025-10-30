import {
  sucursal,
  direccion,
  horario,
  franquicia,
  empleado,
  productos,
  stock,
} from "@/infrastructure/database/generated/prisma";
import * as z from "zod";
import { BranchCreateValidator } from "@/interfaces/validators/branch.validator";

export type IBranchCreateRequest = z.infer<typeof BranchCreateValidator>;

export type IBranchUpdateRequest = Partial<IBranchCreateRequest>;

export interface IBranchDetailedResponse extends sucursal {
  direccion: direccion;
  horario: horario;
  empleado?: empleado[];
  productos?: productos[];
  stock?: stock[];
  franquicia: franquicia;
}

export interface IBranchResponse extends sucursal {}

export interface IHttpError extends Error {
  status: number;
  message: string;
  name: string;
}

export interface IZodErrorResponse {
  message: string;
  errors: any[];
}
