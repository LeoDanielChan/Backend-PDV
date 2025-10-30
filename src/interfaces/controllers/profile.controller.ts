import { Request, Response } from "express";
import { UpdateProfileValidator, ChangePasswordValidator, ForgotPasswordValidator, ResetPasswordValidator } from "../validators/profile.validator";
import { ZodError } from "zod";
import { IUpdateProfileRequest, IChangePasswordRequest, IForgotPasswordRequest, IResetPasswordRequest } from "@/domain/models/IProfile";
// import your use-case class here

export const updateProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    UpdateProfileValidator.parse(req.body);
    const profileData: IUpdateProfileRequest = req.body;
    // const result = await profileUser.updateProfile(profileData);
    return res.status(200).json({ message: "Perfil actualizado exitosamente" });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: "Campos inválidos", errors: error.issues });
    }
    res.status(500).json({ message: "Error al actualizar perfil" });
  }
};

export const changePassword = async (req: Request, res: Response): Promise<any> => {
  try {
    ChangePasswordValidator.parse(req.body);
    const passwordData: IChangePasswordRequest = req.body;
    // const result = await profileUser.changePassword(passwordData);
    return res.status(200).json({ message: "Contraseña actualizada exitosamente" });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: "Campos inválidos", errors: error.issues });
    }
    res.status(500).json({ message: "Error al cambiar la contraseña" });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<any> => {
  try {
    ForgotPasswordValidator.parse(req.body);
    const forgotData: IForgotPasswordRequest = req.body;
    // const result = await profileUser.forgotPassword(forgotData);
    return res.status(200).json({ message: "Token enviado al correo" });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: "Campos inválidos", errors: error.issues });
    }
    res.status(500).json({ message: "Error al enviar token" });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<any> => {
  try {
    ResetPasswordValidator.parse(req.body);
    const resetData: IResetPasswordRequest = req.body;
    // const result = await profileUser.resetPassword(resetData);
    return res.status(200).json({ message: "Contraseña restablecida exitosamente" });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: "Campos inválidos", errors: error.issues });
    }
    res.status(500).json({ message: "Error al restablecer la contraseña" });
  }
};
