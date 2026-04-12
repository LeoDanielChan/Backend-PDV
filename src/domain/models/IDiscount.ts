import { descuentos, clientes, productos } from "@/infrastructure/database/generated/prisma";
import * as z from "zod";
import { DiscountCreateValidator, DiscountUpdateValidator } from "@/interfaces/validators/discount.validator";

export type IDiscountCreateRequest = z.infer<typeof DiscountCreateValidator>;
export type IDiscountUpdateRequest = z.infer<typeof DiscountUpdateValidator>;

export interface IDiscountDetailed extends descuentos {
  clientes: clientes;
  productos: productos;
}