import { categorias } from "@/infrastructure/database/generated/prisma";
import * as z from "zod";
import {
  CreateCategoryValidator,
  UpdateCategoryValidator,
} from "@/interfaces/validators/category.validator";

export type ICreateCategoryRequest = z.infer<typeof CreateCategoryValidator>;

export type IUpdateCategoryRequest = z.infer<typeof UpdateCategoryValidator>;

export interface ICategoryResponse extends categorias {}

export interface ICategorySuccessResponse {
  message: string;
  category: ICategoryResponse;
}

export interface IHttpError extends Error {
  status: number;
  message: string;
  name: string;
}

export interface IZodErrorResponse {
  message: string;
  errors: any[];
}
