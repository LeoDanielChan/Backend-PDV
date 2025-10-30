import { OwnerRepository } from "../repositories/ownerRepository";
import { prisma } from "@/config/prismaClient";
import { IOwnerRes, IFranchiseRequest, IHttpError } from "../models/IOwner";

export class OwnerUser implements OwnerRepository {
  async getUserFranchises(userId: number): Promise<IOwnerRes[]> {
    return (await prisma.franquicia.findMany({
      where: { id_usuario: userId },
    })) as IOwnerRes[];
  }

  async createFranchise(
    userId: number,
    franchiseData: IFranchiseRequest
  ): Promise<IOwnerRes> {
    const existingFranchise = await prisma.franquicia.findFirst({
      where: { id_usuario: userId },
    });
    if (existingFranchise) {
      const error: IHttpError = {
        name: "Conflict",
        status: 409,
        message: "Solo se permite una franquicia por usuario",
      };
      throw error;
    }

    const newFranchise = (await prisma.franquicia.create({
      data: {
        id_usuario: userId,
        nombre: franchiseData.nombre,
        activo: franchiseData.activo,
        fecha_registro: new Date(new Date().getTime() - 6 * 60 * 60 * 1000),
      },
    })) as IOwnerRes;

    return newFranchise;
  }
}
