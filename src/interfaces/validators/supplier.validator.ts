import * as z from "zod";

const SupplierBaseSchema = z.object({
  nombre: z
    .string({ message: "El nombre del proveedor es requerido" })
    .min(2, "El nombre debe tener al menos 2 caracteres"),
  telefono: z
    .string()
    .min(7, "El teléfono debe tener al menos 7 dígitos")
    .optional(),
});

export const SupplierCreateValidator = SupplierBaseSchema.extend({
  sucursal_id: z
    .number()
    .int("El ID de la sucursal debe ser un entero")
    .min(1, "ID de sucursal inválido"),
});

export const SupplierUpdateValidator = SupplierBaseSchema.partial();
