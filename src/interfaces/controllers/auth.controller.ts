import { Request, Response } from "express";
import { UserLoginValidator } from "../validators/auth.validator";
import * as z from "zod";
import { prisma } from "@/config/prismaClient";
import bcrypt from "bcrypt";
import { LoginUser } from "@/domain/use-cases/loginUser";

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    UserLoginValidator.parse(req.body);
    const { email, password } = req.body;

    const userLoginUseCase = new LoginUser();

    userLoginUseCase.login({ email, password });

    //if (!userExists) {
    //  return res.status(404).json({ message: "No existe este usuario" });
    //}
    //
    //const user = userExists;
    //const isPasswordValid = await bcrypt.compare(password, user.password);
    //if (!isPasswordValid) {
    //  return res
    //    .status(401)
    //    .json({ message: "Correo o contraseña incorrectas" });
    //}
    //
    //const token = await user.generateAuthToken();

    return res.status(200).json({ message: "Inicio de sesión exitoso" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.issues;
    }
    res.status(500).json({
      message: "Error al iniciar sesión",
    });
  }
};

export const register = async (req: Request, res: Response) => {};
