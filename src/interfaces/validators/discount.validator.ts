import * as z from "zod";

export const DiscountCreateValidator = z.object({
  cliente_id: z.number().int().positive("ID de cliente inválido"),
  producto_id: z.number().int().positive("ID de producto inválido"),
  descuento: z.number().int().min(1).max(100, "El descuento debe ser entre 1% y 100%"),
});

export const DiscountUpdateValidator = z.object({
  descuento: z.number().int().min(1).max(100),
});

