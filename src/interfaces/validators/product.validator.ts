import * as z from "zod";

const PresentationSchema = z.object({
  unidad_id: z
    .number()
    .int("El ID de la unidad debe ser un entero")
    .min(1, "ID de unidad inválido"),
  precio: z.number().positive("El precio debe ser positivo"),
  cantidad_equivalente: z
    .number()
    .positive("La cantidad equivalente debe ser positiva"),
  descripcion: z.string().optional(),
});

export const ProductCreateValidator = z.object({
  categoria_id: z
    .number()
    .int("El ID de la categoría debe ser un entero")
    .min(1, "ID de categoría inválido"),
  nombre: z
    .string()
    .min(3, "El nombre del producto debe tener al menos 3 caracteres"),

  primario: z.boolean(),

  imagen_url: z
    .number()
    .int("El ID del archivo de imagen debe ser un entero")
    .optional(),

  presentaciones: z
    .array(PresentationSchema)
    .min(1, "Debe especificar al menos una presentación del producto"),
});

export const ProductUpdateValidator = ProductCreateValidator.partial().extend({
  presentaciones: z.array(PresentationSchema).optional(),
});
