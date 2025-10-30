import { franquicia } from "@/infrastructure/database/generated/prisma";

export interface IFranchiseRequest
  extends Pick<franquicia, "nombre" | "activo"> {}

export interface IOwnerRes extends franquicia {}

export interface IHttpError extends Error {
  status: number;
  message: string;
  name: string;
}

export interface IZodErrorResponse {
  message: string;
  errors: any[]; 
}