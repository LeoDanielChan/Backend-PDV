import { Request, Response } from "express";
import { UserLoginValidator, UserRegisterValidator } from "../validators/auth.validator";
import { AuthUser } from "@/domain/use-cases/authUser";
import { ZodError } from "zod";
import { IRegisterRequest } from "@/domain/models/IAuth";

const authUser = new AuthUser();

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    UserLoginValidator.parse(req.body);
    console.log("Validación de inicio de sesión exitosa", req.body);
    const { correo, contrasena } = req.body;

    const result = await authUser.login({ correo, contrasena });

    console.log("Inicio de sesión exitoso:", result);

    return res.status(200).json({
      message: "Inicio de sesión exitoso",
      token: result.token,
      user: result.user,
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      console.log("Error de validación:", error.issues);
      return res.status(400).json({
        message: "Campos inválidos",
        errors: error.issues,
      });
    }

    if (error && error.status && error.message) {
      return res.status(error.status).json({ message: error.message });
    }

    res.status(500).json({
      message: "Error al iniciar sesión",
    });
  }
};

export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    UserRegisterValidator.parse(req.body);
    const userData: IRegisterRequest = req.body;

    const result = await authUser.register(userData);

    return res.status(201).json({
      message: "Usuario registrado exitosamente",
      token: result.token,
      user: result.user,
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Campos inválidos",
        errors: error.issues,
      });
    }

    if (error && error.status && error.message) {
      return res.status(error.status).json({ message: error.message });
    }
    console.error("Error al registrar usuario:", error);
    res.status(500).json({
      message: "Error al registrar usuario",
    });
  }
};
