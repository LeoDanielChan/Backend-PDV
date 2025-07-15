import { UserRepository } from "../repositories/userRepository";
import { prisma } from "@/config/prismaClient";
import { ILoginRequest } from "../models/IUser";

export class LoginUser implements UserRepository {

  async login({ email, password }: ILoginRequest): Promise<any> {
    const userExists = await prisma.usuarios.findFirst({
      where: {
        correo: email,
      },
    });
    console.log("User exists:", userExists);
  }

  async createUser(userData: any): Promise<any> {
    // Implementation for creating a user
  }

  async updateUserPassword(userId: string, newPassword: string): Promise<any> {
    // Implementation for updating user password
  }

  async generateAuthToken(userId: string): Promise<string> {
    return ""; // Implementation for generating auth token
  }
}
