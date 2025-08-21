import { ILoginRequest, IRegisterRequest } from "../models/IAuth";

export interface AuthRepository {
  login({ correo, contrasena }: ILoginRequest): Promise<any>;
  register(userData: IRegisterRequest): Promise<any>;
  updateUserPassword(userId: number, newPassword: string): Promise<any>;
  generateAuthToken(userId: number): Promise<string>;
}
