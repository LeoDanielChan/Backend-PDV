import { OwnerRepository } from "../repositories/ownerRepository";
import { prisma } from "@/config/prismaClient";

export class OwnerUser implements OwnerRepository {
  async getUserFranchises(userId: number): Promise<any[]> {
    return await prisma.franquicia.findMany({
      where: { id_usuario: userId },
    });
  }

  async createFranchise(userId: number, franchiseData: any): Promise<any> {
    console.log("Creando franquicia...");
    return await prisma.franquicia.create({
      data: {
        id_usuario: userId,
        ...franchiseData,
      },
    });
  }
}