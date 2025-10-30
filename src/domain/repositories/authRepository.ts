import {
  ILoginRequest,
  IRegisterRequest,
  IAuthResponse,
} from "../models/IAuth";

export interface AuthRepository {
  login(data: ILoginRequest): Promise<IAuthResponse>;
  register(userData: IRegisterRequest): Promise<IAuthResponse>;
  updateUserPassword(userId: number, newPassword: string): Promise<any>;
  generateAuthToken(userId: number): Promise<string>;
}
