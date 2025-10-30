import { AuthRepository } from "../repositories/authRepository";
import { prisma } from "@/config/prismaClient";
import {
  ILoginRequest,
  IRegisterRequest,
  IAuthResponse,
  IHttpError,
  IAuthUser,
} from "../models/IAuth";
import { passwordService } from "@/infrastructure/auth/passwordService";
import { jwtService } from "@/infrastructure/auth/jwtService";

export class AuthUser implements AuthRepository {
  async login({ correo, contrasena }: ILoginRequest): Promise<IAuthResponse> {
    const user = await prisma.usuarios.findFirst({
      where: { correo: correo },
      select: {
        usuario_id: true,
        correo: true,
        contrasena: true,
        id_tipo_usuario: true,
      },
    });

    if (!user) {
      const error: IHttpError = {
        name: "Unauthorized",
        status: 401,
        message: "Correo o contraseña incorrectos",
      };
      throw error;
    }

    const isValid = await passwordService.compare(contrasena, user.contrasena);
    if (!isValid) {
      const error: IHttpError = {
        name: "Unauthorized",
        status: 401,
        message: "Correo o contraseña incorrectos",
      };
      throw error;
    }

    const token = jwtService.sign({
      userId: user.usuario_id,
      tipo_usuario: user.id_tipo_usuario,
    });

    const AuthUser: IAuthUser = {
      userId: user.usuario_id,
      correo: user.correo,
      tipo_usuario: user.id_tipo_usuario,
    };

    return {
      token,
      user: AuthUser,
    };
  }

  async register(userData: IRegisterRequest): Promise<IAuthResponse> {
    console.log("Registrando usuario con datos:", userData);
    const exists = await prisma.usuarios.findFirst({
      where: { correo: userData.usuario.correo },
    });
    if (exists) {
      const error: IHttpError = {
        name: "Conflict",
        status: 409,
        message: "El correo ya está registrado",
      };
      throw error;
    }

    const fechaNacimientoDate = new Date(userData.persona.fecha_nacimiento);

    const newPersona = await prisma.personas.create({
      data: {
        nombre: userData.persona.nombre,
        ap_paterno: userData.persona.ap_paterno,
        ap_materno: userData.persona.ap_materno,
        genero: userData.persona.genero,
        fecha_nacimiento: fechaNacimientoDate,
        rfc: userData.persona.rfc,
        ine: userData.persona.ine,
        telefono: userData.persona.telefono,
      },
    });

    const hashedPassword = await passwordService.hash(
      userData.usuario.contrasena
    );

    const newUser = await prisma.usuarios.create({
      data: {
        correo: userData.usuario.correo,
        contrasena: hashedPassword,
        id_persona: newPersona.persona_id,
        fecha_registro: new Date(),
        id_tipo_usuario: userData.persona.tipo_usuario,
      },
    });

    const token = jwtService.sign({
      userId: newUser.usuario_id,
      tipo_usuario: newUser.id_tipo_usuario,
    });

    const authUser: IAuthUser = {
      userId: newUser.usuario_id,
      correo: newUser.correo,
      tipo_usuario: newUser.id_tipo_usuario,
    };

    return {
      token,
      user: authUser,
    };
  }

  async updateUserPassword(userId: number, newPassword: string): Promise<void> {
    const hashedPassword = await passwordService.hash(newPassword);
    await prisma.usuarios.update({
      where: { usuario_id: userId },
      data: { contrasena: hashedPassword, cambia_contrasena: false },
    });
  }

  async generateAuthToken(userId: number): Promise<string> {
    const user = await prisma.usuarios.findUnique({
      where: { usuario_id: userId },
      select: { id_tipo_usuario: true },
    });

    if (!user) {
      const error: IHttpError = {
        name: "Not Found",
        status: 404,
        message: "Usuario no encontrado",
      };
      throw error;
    }

    return jwtService.sign({ userId, tipo_usuario: user.id_tipo_usuario });
  }
}
