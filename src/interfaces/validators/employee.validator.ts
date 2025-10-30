import { z } from "zod";

const PersonaSchema = z.object({
  nombre: z.string().min(2, "Nombre requerido"),
  ap_paterno: z.string().min(2, "Apellido paterno requerido"),
  ap_materno: z.string().min(2, "Apellido materno requerido"),
  genero: z.boolean(),
  fecha_nacimiento: z
    .string()
    .min(8, "Fecha de nacimiento requerida (YYYY-MM-DD)"),
  rfc: z.string().min(10, "RFC requerido"),
  ine: z.string().min(5, "INE requerido"),
  telefono: z.string().min(10, "Teléfono requerido"),
});

const UsuarioSchema = z.object({
  correo: z.email("Correo electrónico inválido"),
  contrasena: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
  id_tipo_usuario: z
    .number()
    .int("Tipo de usuario debe ser un número entero")
    .min(1, "Tipo de usuario requerido"),
});

const EmpleadoSchema = z.object({
  id_sucursal: z
    .number()
    .int("ID de sucursal debe ser un entero")
    .min(1, "ID de sucursal requerido"),
  sueldo: z.number().positive("Sueldo debe ser un valor positivo").optional(),
  descripcion_puesto: z.string().optional(),
  fecha_contratacion: z
    .string()
    .min(8, "Fecha de contratación requerida (YYYY-MM-DD)"), // String
  telefono_emergencia: z.string().optional(),
  periodo_pago: z.string().optional(),
  tipo_pago: z.string().optional(),
  horas_trabajo: z
    .string()
    .regex(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "Formato de hora de trabajo inválido (HH:MM)"
    )
    .optional(),
});

export const EmployeeCreateValidator = z.object({
  persona: PersonaSchema,
  usuario: UsuarioSchema,
  empleado: EmpleadoSchema,
});

export const EmployeeUpdateValidator = z.object({
  persona: PersonaSchema.partial().optional(),
  usuario: UsuarioSchema.partial()
    .omit({ contrasena: true, id_tipo_usuario: true })
    .optional(), // Contraseña y tipo de usuario se cambian en rutas separadas.
  empleado: EmpleadoSchema.partial()
    .omit({ id_sucursal: true, fecha_contratacion: true })
    .optional(), // ID de sucursal y fecha de contrato no se cambian fácilmente.
});
