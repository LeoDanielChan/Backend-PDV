import { AuthRepository } from "../repositories/authRepository";
import { prisma } from "@/config/prismaClient";
import { ILoginRequest, IRegisterRequest } from "../models/IAuth";
import { passwordService } from "@/infrastructure/auth/passwordService";
import { jwtService } from "@/infrastructure/auth/jwtService";

export class AuthUser implements AuthRepository {

  async login({ correo, contrasena }: ILoginRequest): Promise<any> {
    const user = await prisma.usuarios.findFirst({
      where: { correo: correo },
    });
    if (!user) {
      throw { status: 401, message: "Correo o contraseña incorrectos" };
    }

    const isValid = await passwordService.compare(contrasena, user.contrasena);
    if (!isValid) {
      throw { status: 401, message: "Usuario o contraseña incorrectos" };
    }

    const payload = {
      userId: user.usuario_id,
      tipo_usuario: user.id_tipo_usuario ?? undefined
    };

    
    const token = jwtService.sign(payload);

    return {
      token,
      user: {
        userId: user.usuario_id,
        correo: user.correo,
      },
    };
  }

  async register(userData: IRegisterRequest): Promise<any> {
    const exists = await prisma.usuarios.findFirst({
      where: { correo: userData.usuario.correo },
    });
    if (exists) {
      throw { status: 409, message: "El correo ya está registrado" };
    }

    const newPersona = await prisma.personas.create({
      data: {
        nombre: userData.persona.nombre,
        ap_paterno: userData.persona.ap_paterno,
        ap_materno: userData.persona.ap_materno,
        genero: userData.persona.genero,
        fecha_nacimiento: new Date(userData.persona.fecha_nacimiento),
        rfc: userData.persona.rfc,
        ine: userData.persona.ine,
        telefono: userData.persona.telefono,
      },
    });

    const hashedPassword = await passwordService.hash(userData.usuario.contrasena);

    const newUser = await prisma.usuarios.create({
      data: {
        correo: userData.usuario.correo,
        contrasena: hashedPassword,
        id_persona: newPersona.persona_id,
        fecha_registro: new Date(),
        id_tipo_usuario: userData.persona.tipo_usuario,
      },
    });

    const token = jwtService.sign({ userId: newUser.usuario_id, tipo_usuario: newUser.id_tipo_usuario ?? undefined });
    return {
      token,
      user: {
        userId: newUser.usuario_id,
        correo: newUser.correo,
      },
    };
  }

  async updateUserPassword(userId: number, newPassword: string): Promise<any> {
    // Implementation for updating user password
  }

  async generateAuthToken(userId: number): Promise<string> {
    return jwtService.sign({ userId });
  }
}
