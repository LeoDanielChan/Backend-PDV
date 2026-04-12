import {
  ventas,
  detalle_ventas,
  pagos,
  clientes,
  usuarios,
  sucursal,
} from "@/infrastructure/database/generated/prisma";
import * as z from "zod";
import {
  CreateSaleValidator,
  AddPaymentValidator,
} from "@/interfaces/validators/sale.validator";

// Requests inferidos de Zod
export type ICreateSaleRequest = z.infer<typeof CreateSaleValidator>;
export type IAddPaymentRequest = z.infer<typeof AddPaymentValidator>;

// Interfaces de Respuesta
export interface ISaleDetailed extends ventas {
  detalle_ventas: detalle_ventas[];
  pagos: pagos[]; // Historial de pagos de esta venta
  clientes?: clientes | null;
  usuarios: usuarios;
  sucursal: sucursal;
  saldo_pendiente?: number; // Campo calculado útil para el frontend
}

export interface IPaymentResponse extends pagos {
  nuevo_estado_venta: string;
  saldo_restante: number;
}
