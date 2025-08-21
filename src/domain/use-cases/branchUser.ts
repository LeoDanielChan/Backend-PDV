import { BranchRepository } from "../repositories/branchRepository";
import { prisma } from "@/config/prismaClient";

class BranchUserUseCase implements BranchRepository {
  async getAllBranches(id_franquicia: number): Promise<any[]> {
    return await prisma.sucursal.findMany({
      where: { franquicia: { franquicia_id: id_franquicia } },
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
    const timeStringToDate = (timeString: string): Date => {
      const [hours, minutes, seconds] = timeString.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, minutes, seconds || 0, 0);
      date.setFullYear(1970, 0, 1);
      return date;
    };

    return await prisma.sucursal.create({
      data: {
        fecha_de_alta: new Date(),
        activo: data.activo ?? true,
        telefono: data.telefono,
        correo: data.correo,
        franquicia: { connect: { franquicia_id: data.id_franquicia } },
        direccion: data.direccion ? {
          create: {
            ...data.direccion,
            fecha_registro: new Date()
          }
        } : undefined,
        horario: data.horario ? {
          create: {
            hora_apertura: timeStringToDate(data.horario.hora_apertura),
            hora_cierre: timeStringToDate(data.horario.hora_cierre),
            estado: data.horario.estado,
            id_dia: data.horario.id_dia
          }
        } : undefined,
      },
      include: {
        direccion: true,
        horario: true,
        franquicia: true,
      },
    });
  }

  async updateBranch(branchId: number, data: any): Promise<any> {
    return await prisma.sucursal.update({ where: { sucursal_id: branchId }, data });
  }
  async deleteBranch(branchId: number): Promise<void> {
    await prisma.sucursal.delete({ where: { sucursal_id: branchId } });
  }
}

export const branchUserUseCase = new BranchUserUseCase();
