import * as z from "zod";
import {
  empleado,
  personas,
  usuarios,
} from "@/infrastructure/database/generated/prisma";
import {
  EmployeeCreateValidator,
  EmployeeUpdateValidator,
} from "@/interfaces/validators/employee.validator";

export type IEmployeeCreateRequest = z.infer<typeof EmployeeCreateValidator>;
export type IEmployeeUpdateRequest = z.infer<typeof EmployeeUpdateValidator>;

export interface IPersonaDetailed extends personas {}

export interface IUsuarioDetailed extends Omit<usuarios, "contrasena"> {
  personas: IPersonaDetailed;
}

export interface IEmployeeDetailedResponse extends empleado {
  usuarios_empleado_id_usuarioTousuarios: IUsuarioDetailed;
  usuarios_empleado_id_usuario_registroTousuarios: usuarios;
}

export interface IEmployeeResponse extends empleado {}

export interface IHttpError extends Error {
  status: number;
  message: string;
  name: string;
}

export interface IZodErrorResponse {
  message: string;
  errors: any[];
}
