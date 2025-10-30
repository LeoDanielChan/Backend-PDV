import { timeStringToDate } from "@/utils/timeUtilis";
import { BranchRepository } from "../repositories/branchRepository";
import { prisma } from "@/config/prismaClient";
import {
  IBranchCreateRequest,
  IBranchDetailedResponse,
  IBranchResponse,
  IBranchUpdateRequest,
  IHttpError,
} from "../models/IBranch";

const getFranchiseIdFromUserId = async (userId: number): Promise<number> => {
  const franchise = await prisma.franquicia.findFirst({
    where: { id_usuario: userId },
    select: { franquicia_id: true },
  });
  if (!franchise) {
    const error: IHttpError = {
      name: "NotFound",
      status: 404,
      message: "No se encontró franquicia asociada al usuario",
    };
    throw error;
  }
  return franchise.franquicia_id;
};

type TimeHHMM = string;

class BranchUserUseCase implements BranchRepository {
  async getAllBranches(userId: number): Promise<IBranchResponse[]> {
    const franchiseId = await getFranchiseIdFromUserId(userId);

    return (await prisma.sucursal.findMany({
      where: { id_franquicia: franchiseId },
    })) as IBranchResponse[];
  }

  async getBranchById(
    userId: number,
    branchId: number
  ): Promise<IBranchDetailedResponse | null> {
    const franchiseId = await getFranchiseIdFromUserId(userId);

    return (await prisma.sucursal.findFirst({
      where: {
        sucursal_id: branchId,
        id_franquicia: franchiseId,
      },
      include: {
        direccion: true,
        horario: true,
        empleado: true,
        productos: true,
        stock: true,
        franquicia: true,
      },
    })) as IBranchDetailedResponse | null;
  }

  async createBranch(
    data: IBranchCreateRequest
  ): Promise<IBranchDetailedResponse> {
    return (await prisma.sucursal.create({
      data: {
        fecha_de_alta: new Date(),
        activo: data.activo ?? true,
        telefono: data.telefono,
        correo: data.correo,
        franquicia: { connect: { franquicia_id: data.id_franquicia } },
        direccion: {
          create: {
            ...data.direccion!,
            fecha_registro: new Date(),
          },
        },
        horario: {
          create: {
            hora_apertura: timeStringToDate(data.horario!.hora_apertura),
            hora_cierre: timeStringToDate(data.horario!.hora_cierre),
            estado: data.horario!.estado,
            id_dia: data.horario!.id_dia,
          },
        },
      },
      include: {
        direccion: true,
        horario: true,
        franquicia: true,
      },
    })) as IBranchDetailedResponse;
  }

  async updateBranch(
    branchId: number,
    data: IBranchUpdateRequest
  ): Promise<IBranchResponse> {
    const { direccion, horario, id_franquicia, ...sucursalData } = data;
    const updatePayload: any = {
      ...sucursalData,
    };

    if (direccion) {
      const currentBranch = await prisma.sucursal.findUnique({
        where: { sucursal_id: branchId },
        select: { id_direccion: true },
      });

      if (currentBranch?.id_direccion) {
        updatePayload.direccion = {
          update: {
            ...direccion,
          },
        };
      }
    }

    if (horario) {
      const currentBranch = await prisma.sucursal.findUnique({
        where: { sucursal_id: branchId },
        select: { id_horario: true },
      });

      if (currentBranch?.id_horario) {
        updatePayload.horario = {
          update: {
            ...horario,
            hora_apertura: horario.hora_apertura
              ? timeStringToDate(horario.hora_apertura)
              : undefined,
            hora_cierre: horario.hora_cierre
              ? timeStringToDate(horario.hora_cierre)
              : undefined,
          },
        };
      }
    }
    return (await prisma.sucursal.update({
      where: { sucursal_id: branchId },
      data: updatePayload,
    })) as IBranchResponse;
  }
  
  async deleteBranch(branchId: number): Promise<void> {
    await prisma.sucursal.delete({ where: { sucursal_id: branchId } });
  }
}

export const branchUserUseCase = new BranchUserUseCase();
