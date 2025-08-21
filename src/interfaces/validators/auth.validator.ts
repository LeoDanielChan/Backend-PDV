import * as z from "zod";

export const UserLoginValidator = z.object({
  correo: z.email("Correo electrónico inválido"),
  contrasena: z.string("Se espera un campo de tipo string").min(6, "Contraseña inválida"),
});

export const UserRegisterValidator = z.object({
  persona: z.object({
    tipo_usuario: z.number().min(1, "Tipo de usuario requerido"),
    nombre: z.string().min(2, "Nombre requerido"),
    ap_paterno: z.string().min(2, "Apellido paterno requerido"),
    ap_materno: z.string().min(2, "Apellido materno requerido"),
    genero: z.boolean(),
    fecha_nacimiento: z.string().min(8, "Fecha de nacimiento requerida"),
    rfc: z.string().min(10, "RFC requerido"),
    ine: z.string().min(5, "INE requerido"),
    telefono: z.string().min(10, "Teléfono requerido"),
  }),
  usuario: z.object({
    correo: z.email("Correo electrónico inválido"),
    contrasena: z.string().min(6, "Contraseña inválida"),
  }),
})