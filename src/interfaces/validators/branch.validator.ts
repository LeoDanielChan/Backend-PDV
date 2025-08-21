import * as z from "zod";

export const BranchCreateValidator = z.object({
  id_franquicia: z.number(),
  telefono: z.string().min(7).optional(),
  correo: z.email().optional(),
  activo: z.boolean().optional(),
  direccion: z.object({
    calle: z.string(),
    no_interior: z.string().optional(),
    no_exterior: z.string().optional(),
    codigo_postal: z.string(),
    referencia: z.string().optional(),
    latitud: z.string().optional(),
    longitud: z.string().optional(),
  }).optional(),
  horario: z.object({
    hora_apertura: z.string(),
    hora_cierre: z.string(),
    estado: z.number(),
    id_dia: z.number().optional(),
  }).optional(),
});
