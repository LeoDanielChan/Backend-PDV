import * as z  from "zod";

export const UpdateProfileValidator = z.object({
  correo: z.email().optional(),
  id_archivo_perfil: z.number().optional(),

  nombre: z.string().min(1).max(255).optional(),
  ap_paterno: z.string().max(255).optional(),
  ap_materno: z.string().max(255).optional(),
  genero: z.boolean().optional(),
  fecha_nacimiento: z.union([z.string(), z.date()]).optional(),
  rfc: z.string().max(255).optional(),
  ine: z.string().max(255).optional(),
  telefono: z.string().max(255).optional(),

  archivo: z.object({
    archivo_id: z.number().optional(),
    url: z.string().max(255).optional(),
    nombre: z.string().max(255).optional(),
    tamano: z.number().optional(),
    tipo: z.string().max(255).optional(),
  }).optional(),

  empleado: z.object({
    sueldo: z.number().optional(),
    descripcion_puesto: z.string().max(255).optional(),
    fecha_contratacion: z.union([z.string(), z.date()]).optional(),
    fecha_baja: z.union([z.string(), z.date()]).optional(),
    fecha_registro: z.union([z.string(), z.date()]).optional(),
    telefono_emergencia: z.string().max(255).optional(),
    periodo_pago: z.string().max(255).optional(),
    tipo_pago: z.string().max(255).optional(),
    horas_trabajo: z.string().optional(),
    activo: z.number().optional(),
  }).optional(),
});

export const ChangePasswordValidator = z.object({
  correo: z.email(),
  oldPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

export const ForgotPasswordValidator = z.object({
  correo: z.email(),
});

export const ResetPasswordValidator = z.object({
  token: z.string().min(10),
  newPassword: z.string().min(6),
});
