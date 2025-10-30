import { z } from "zod";

export const CreateCategoryValidator = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  descripcion: z.string().optional(),
  sucursal_id: z
    .number()
    .int("El ID de sucursal debe ser un entero")
    .min(1, "ID de sucursal inválido"),
});

export const UpdateCategoryValidator = z.object({
  categoria_id: z
    .number()
    .int("El ID de categoría debe ser un entero")
    .min(1, "ID de categoría inválido"),
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .optional(),
  descripcion: z.string().optional(),
  sucursal_id: z
    .number()
    .int("El ID de sucursal debe ser un entero")
    .min(1, "ID de sucursal inválido")
    .optional(),
});

export const CategoriesByCategoryValidator = z.object({
  categoryId: z
    .number()
    .int("El ID de la categoría debe ser un entero")
    .min(1, "ID de categoría inválido"),
});

export const ListCategoriesBySucursalValidator = z.object({
  sucursal_id: z
    .number()
    .int("El ID de sucursal debe ser un entero")
    .min(1, "ID de sucursal inválido"),
});
