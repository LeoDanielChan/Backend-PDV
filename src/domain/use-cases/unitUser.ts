import { prisma } from "@/config/prismaClient";
import { UnitRepository } from "../repositories/unitRepository";
import {
  IUnitCreateRequest,
  IUnitUpdateRequest,
  IUnitResponse,
  IHttpError,
} from "../models/IUnit";

export class UnitUser implements UnitRepository {
  async getAllUnits(): Promise<IUnitResponse[]> {
    return prisma.unidad_venta.findMany() as Promise<IUnitResponse[]>;
  }

  async getUnitById(unitId: number): Promise<IUnitResponse | null> {
    return prisma.unidad_venta.findUnique({
      where: { unidad_id: unitId },
    }) as Promise<IUnitResponse | null>;
  }

  async createUnit(data: IUnitCreateRequest): Promise<IUnitResponse> {
    const exists = await prisma.unidad_venta.findFirst({
      where: {
        OR: [{ nombre: data.nombre }, { simbolo: data.simbolo }],
      },
    });

    if (exists) {
      const error: IHttpError = {
        name: "Conflict",
        status: 409,
        message: "Ya existe una unidad de venta con ese nombre o símbolo.",
      };
      throw error;
    }

    return prisma.unidad_venta.create({ data }) as Promise<IUnitResponse>;
  }

  async updateUnit(data: IUnitUpdateRequest): Promise<IUnitResponse> {
    const { unidad_id, ...rest } = data;

    // Verificar existencia antes de actualizar
    const exists = await prisma.unidad_venta.findUnique({
      where: { unidad_id },
    });

    if (!exists) {
      const error: IHttpError = {
        name: "NotFound",
        status: 404,
        message: "Unidad de venta no encontrada para actualizar.",
      };
      throw error;
    }

    return prisma.unidad_venta.update({
      where: { unidad_id },
      data: rest,
    }) as Promise<IUnitResponse>;
  }

  async deleteUnit(unitId: number): Promise<void> {
    try {
      await prisma.unidad_venta.delete({ where: { unidad_id: unitId } });
    } catch (e) {
      const error: IHttpError = {
        name: "Conflict",
        status: 409,
        message:
          "No se puede eliminar la unidad, está siendo utilizada por productos.",
      };
      throw error;
    }
  }
}

export const unitUserUseCase = new UnitUser();
