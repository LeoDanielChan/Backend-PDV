import * as z from "zod";

const timeFormatRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

export const BranchCreateValidator = z.object({
  id_franquicia: z.number().min(1, "ID de franquicia inválido"),
  telefono: z.string().min(7, "El teléfono debe tener al menos 7 dígitos").optional(),
  correo: z.email("Correo electrónico inválido").optional(),
  activo: z.boolean().optional(),
  direccion: z.object({
    calle: z.string().min(3, "Calle inválida"),
    no_interior: z.string().optional(),
    no_exterior: z.string().optional(),
    codigo_postal: z.string().min(4, "CP inválido"),
    referencia: z.string().optional(),
    latitud: z.string().optional(),
    longitud: z.string().optional(),
  }),
  horario: z.object({
    id_dia: z.number().min(1, "ID de día inválido"),
    estado: z.number().min(0).max(1), 
    hora_apertura: z.string().regex(timeFormatRegex, "La hora de apertura debe tener formato HH:MM"),
    hora_cierre: z.string().regex(timeFormatRegex, "La hora de cierre debe tener formato HH:MM"),
  }),
});

export const BranchUpdateValidator = BranchCreateValidator.partial();