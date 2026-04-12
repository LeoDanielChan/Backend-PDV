import * as z from "zod";

const StockBaseSchema = z.object({
  producto_id: z.number().int().positive("ID de producto inválido"),
  sucursal_id: z.number().int().positive("ID de sucursal inválido"),
  unidad_id: z.number().int().positive("ID de unidad inválido"),
});

export const StockEntryValidator = StockBaseSchema.extend({
  cantidad: z.number().positive("La cantidad debe ser mayor a 0"),
  costo: z.number().nonnegative("El costo no puede ser negativo"),
  
  proveedor_origen_id: z.number().int().positive().optional(),
  cliente_origen_id: z.number().int().positive().optional(),
  
  tipo_origen: z.enum(["COMPRA", "INTERCAMBIO", "DEVOLUCION"]).default("COMPRA"),
}).refine((data) => data.proveedor_origen_id || data.cliente_origen_id, {
  message: "Debe especificar un proveedor_origen_id o un cliente_origen_id",
  path: ["proveedor_origen_id"],
});

// const StockBaseSchema = z.object({
//   producto_id: z
//     .number()
//     .int("El ID del producto debe ser un entero")
//     .min(1, "ID de producto inválido")
//     .positive("El ID del producto debe ser positivo"),
//   cantidad: z.number().positive("La cantidad (peso) debe ser positiva"),
//   costo: z.number().nonnegative("El costo debe ser cero o positivo"),
// });

export const StockProcessValidator = z.object({
  stock_padre_id: z.number().int().positive("ID del stock padre (res) es requerido"),
  cortes: z.array(
    z.object({
      producto_id: z.number().int().positive(),
      unidad_id: z.number().int().positive(), // Kilos, Litros, etc.
      peso: z.number().positive("El peso del corte debe ser positivo"),
    })
  ).min(1, "Debe registrar al menos un corte resultante"),
  
  finalizar_padre: z.boolean().default(true), 
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
