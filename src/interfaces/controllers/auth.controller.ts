import { Request, Response } from "express";
import {
  UserLoginValidator,
  UserRegisterValidator,
} from "../validators/auth.validator";
import { AuthUser } from "@/domain/use-cases/authUser";
import { ZodError } from "zod";
import {
  IHttpError,
  ILoginRequest,
  IRegisterRequest,
} from "@/domain/models/IAuth";

const authUser = new AuthUser();

export const login = async (
  req: Request<{}, {}, ILoginRequest>,
  res: Response
): Promise<any> => {
  try {
    const data: ILoginRequest = UserLoginValidator.parse(req.body);
    const { correo, contrasena } = data;

    const result = await authUser.login({ correo, contrasena });

    return res.status(200).json({
      message: "Inicio de sesión exitoso",
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Campos inválidos",
        errors: error.issues,
      });
    }

    const httpError = error as IHttpError;
    if (httpError.status && httpError.message) {
      return res.status(httpError.status).json({ message: httpError.message });
    }

    console.error("Error en login:", error);

    res.status(500).json({
      message: "Error al iniciar sesión",
    });
  }
};

export const register = async (
  req: Request<{}, {}, IRegisterRequest>,
  res: Response
): Promise<any> => {
  try {
    const userData: IRegisterRequest = UserRegisterValidator.parse(req.body);

    const result = await authUser.register(userData);

    return res.status(201).json({
      message: "Usuario registrado exitosamente",
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Campos inválidos",
        errors: error.issues,
      });
    }

    const httpError = error as IHttpError;
    if (httpError.status && httpError.message) {
      return res.status(httpError.status).json({ message: httpError.message });
    }

    console.error("Error en registro:", error);

    res.status(500).json({
      message: "Error interno del servidor al registrar usuario",
    });
  }
};
