import * as z from "zod";

export const FranchiseCreateValidator = z.object({
  nombre: z.string().min(3, "El nombre de la franquicia debe tener al menos 3 caracteres"),
  activo: z.boolean().default(true),
});