import { ILoginRequest } from "../models/IUser";

export interface UserRepository {
  login({ email, password }: ILoginRequest): Promise<any>;
  createUser(userData: any): Promise<any>;
  updateUserPassword(userId: string, newPassword: string): Promise<any>;
  generateAuthToken(userId: string): Promise<string>;
}
