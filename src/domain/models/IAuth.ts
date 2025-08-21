export interface ILoginRequest {
  correo: string;
  contrasena: string;
}

export interface IRegisterRequest {
  persona: {
    tipo_usuario: number;
    nombre: string;
    ap_paterno: string;
    ap_materno: string;
    genero: boolean;
    fecha_nacimiento: Date;
    rfc: string;
    ine: string;
    telefono: string;
  }
  usuario: {
    correo: string;
    contrasena: string;
  };
}