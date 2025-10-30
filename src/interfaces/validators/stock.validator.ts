import * as z from "zod";

const StockBaseSchema = z.object({
  producto_id: z
    .number()
    .int("El ID del producto debe ser un entero")
    .min(1, "ID de producto inválido"),
  cantidad: z.number().positive("La cantidad (peso) debe ser positiva"),
  costo: z.number().nonnegative("El costo debe ser cero o positivo"),
});

export const PrimaryStockCreateValidator = StockBaseSchema.extend({
  proveedor_origen_id: z
    .number()
    .int("El ID de origen (Proveedor) debe ser un entero")
    .min(1, "ID de proveedor inválido"),
  tipo_origen: z.literal("Proveedor", {
    message: "El tipo de origen debe ser 'Proveedor'",
  }),
  cliente_origen_id: z.null().optional(),
  stock_primario: z.null().optional(),
});

export const DerivedStockCreateValidator = StockBaseSchema.extend({
  stock_primario: z
    .number()
    .int("El ID de stock primario debe ser un entero")
    .min(1, "ID de stock primario inválido"),
  proveedor_origen_id: z.null().optional(),
  cliente_origen_id: z.null().optional(),
  tipo_origen: z.string().optional(),
});

export const StockUpdateValidator = StockBaseSchema.partial().extend({
  stock_primario: z
    .number()
    .int("El ID de stock primario debe ser un entero")
    .min(1, "ID de stock primario inválido")
    .optional(),
});
