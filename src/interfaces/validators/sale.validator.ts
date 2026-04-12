import * as z from "zod";

// Validar items dentro de la venta
const SaleDetailSchema = z.object({
  producto_id: z.number().int().positive(),
  presentacion_id: z.number().int().positive(), // Ej: Kilo, Pieza, Paquete
  cantidad: z.number().positive("La cantidad debe ser mayor a 0"),
});

// --- 1. Crear Venta (Orden) ---
export const CreateSaleValidator = z.object({
  sucursal_id: z.number().int().positive(),
  usuario_id: z.number().int().positive(), // Quién hace la venta (Cajero)
  cliente_id: z.number().int().positive().optional(), // Opcional (Venta público general)
  
  productos: z.array(SaleDetailSchema).min(1, "La venta debe tener al menos un producto"),
});

// --- 2. Registrar Pago (Abono o Liquidación) ---
export const AddPaymentValidator = z.object({
  venta_id: z.number().int().positive(),
  monto: z.number().positive("El monto del pago debe ser positivo"),
  metodo_pago: z.enum(["EFECTIVO", "TARJETA_DEBITO", "TARJETA_CREDITO", "TRANSFERENCIA"]),
});