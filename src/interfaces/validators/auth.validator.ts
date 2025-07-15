import * as z from "zod";

export const UserLoginValidator = z.object({
  email: z.email("Correo electrónico inválido"),
  password: z.string().min(6, "Contraseña inválida"),
});
