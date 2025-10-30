export interface IEmpleadoUpdate {
  sueldo?: number;
  descripcion_puesto?: string;
  fecha_contratacion?: Date | string;
  fecha_baja?: Date | string;
  fecha_registro?: Date | string;
  telefono_emergencia?: string;
  periodo_pago?: string;
  tipo_pago?: string;
  horas_trabajo?: string;
  activo?: number;
}

export interface IUpdateProfileRequest {
  // usuario
  correo?: string;
  id_archivo_perfil?: number;

  // persona
  nombre?: string;
  ap_paterno?: string;
  ap_materno?: string;
  genero?: boolean;
  fecha_nacimiento?: Date | string;
  rfc?: string;
  ine?: string;
  telefono?: string;

  // archivo (foto de perfil)
  archivo?: {
    archivo_id?: number;
    url?: string;
    nombre?: string;
    tamano?: number;
    tipo?: string;
  };

  // empleado
  empleado?: IEmpleadoUpdate;
}

export interface IChangePasswordRequest {
  correo: string;
  oldPassword: string;
  newPassword: string;
}

export interface IForgotPasswordRequest {
  correo: string;
}

export interface IResetPasswordRequest {
  token: string;
  newPassword: string;
}
