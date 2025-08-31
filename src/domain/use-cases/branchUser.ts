import { timeStringToDate } from "@/utils/timeUtilis";
import { BranchRepository } from "../repositories/branchRepository";
import { prisma } from "@/config/prismaClient";

type TimeHHMM = string;

const isValidTime = (time: string): time is TimeHHMM => {
  const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return regex.test(time);
};

class BranchUserUseCase implements BranchRepository {
  async getAllBranches(id_franquicia: number): Promise<any[]> {
    return await prisma.sucursal.findMany({
      where: { franquicia: { franquicia_id: id_franquicia } },
    });
  }

  async getBranchById(id_franquicia: number, branchId: number): Promise<any> {
    return await prisma.sucursal.findFirst({
      where: {
        sucursal_id: branchId,
        franquicia: { franquicia_id: id_franquicia },
      },
      include: {
        direccion: true,
        horario: true,
        empleado: true,
        productos: true,
        stock: true,
        franquicia: true,
      },
    });
  }

  async createBranch(data: any): Promise<any> {
    if (data.horario) {
      if (
        data.horario.hora_apertura &&
        !isValidTime(data.horario.hora_apertura)
      ) {
        console.error('Formato de hora_apertura inválido. Use HH:MM', data.horario.hora_apertura);
        throw new Error("Formato de hora_apertura inválido. Use HH:MM");
      }
      if (data.horario.hora_cierre && !isValidTime(data.horario.hora_cierre)) {
        console.error('Formato de hora_cierre inválido. Use HH:MM', data.horario.hora_cierre);
        throw new Error("Formato de hora_cierre inválido. Use HH:MM");
      }
    }

    return await prisma.sucursal.create({
      data: {
        fecha_de_alta: new Date(),
        activo: data.activo ?? true,
        telefono: data.telefono,
        correo: data.correo,
        franquicia: { connect: { franquicia_id: data.id_franquicia } },
        direccion: data.direccion
          ? {
              create: {
                ...data.direccion,
                fecha_registro: new Date(),
              },
            }
          : undefined,
        horario: data.horario
          ? {
              create: {
                hora_apertura: timeStringToDate(data.horario.hora_apertura),
                hora_cierre: timeStringToDate(data.horario.hora_cierre),
                estado: data.horario.estado,
                id_dia: data.horario.id_dia,
              },
            }
          : undefined,
      },
      include: {
        direccion: true,
        horario: true,
        franquicia: true,
      },
    });
  }

  async updateBranch(branchId: number, data: any): Promise<any> {
    return await prisma.sucursal.update({
      where: { sucursal_id: branchId },
      data,
    });
  }
  async deleteBranch(branchId: number): Promise<void> {
    await prisma.sucursal.delete({ where: { sucursal_id: branchId } });
  }
}

export const branchUserUseCase = new BranchUserUseCase();
