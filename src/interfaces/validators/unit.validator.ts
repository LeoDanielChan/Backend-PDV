import * as z from "zod";

export const UnitCreateValidator = z.object({
  nombre: z.string().min(1, "El nombre no puede estar vacío"),
  simbolo: z
    .string()
    .max(10, "El símbolo no puede exceder los 10 caracteres")
    .optional(),
});

export const UnitUpdateValidator = UnitCreateValidator.partial().extend({
  unidad_id: z
    .number()
    .int("El ID de la unidad debe ser un entero")
    .min(1, "ID de unidad inválido"),
});
