import { prisma } from "@/config/prismaClient";
import { SupplierRepository } from "../repositories/supplierRepository";
import {
  ISupplierCreateRequest,
  ISupplierUpdateRequest,
  ISupplierResponse,
  IHttpError,
} from "../models/ISupplier";

export class SupplierUser implements SupplierRepository {
  async getAllSuppliers(branchId: number): Promise<ISupplierResponse[]> {
    return prisma.proveedores.findMany({
      where: { sucursal_id: branchId },
    }) as Promise<ISupplierResponse[]>;
  }

  async getSupplierById(supplierId: number): Promise<ISupplierResponse | null> {
    return prisma.proveedores.findUnique({
      where: { proveedor_id: supplierId },
    }) as Promise<ISupplierResponse | null>;
  }

  async createSupplier(
    data: ISupplierCreateRequest
  ): Promise<ISupplierResponse> {
    const exists = await prisma.proveedores.findFirst({
      where: {
        nombre: data.nombre,
        sucursal_id: data.sucursal_id,
      },
    });

    if (exists) {
      const error: IHttpError = {
        name: "Conflict",
        status: 409,
        message: "Ya existe un proveedor con ese nombre en esta sucursal.",
      };
      throw error;
    }

    return prisma.proveedores.create({
      data: {
        ...data,
        created_at: new Date(),
      },
    }) as Promise<ISupplierResponse>;
  }

  async updateSupplier(
    supplierId: number,
    data: ISupplierUpdateRequest
  ): Promise<ISupplierResponse> {
    const updatePayload = {
      ...data,
      update_at: new Date(),
    };

    return prisma.proveedores.update({
      where: { proveedor_id: supplierId },
      data: updatePayload,
    }) as Promise<ISupplierResponse>;
  }

  async deleteSupplier(supplierId: number): Promise<void> {
    const stockCount = await prisma.stock.count({
      where: { origen_id: supplierId, tipo_origen: "Proveedor" },
    });

    if (stockCount > 0) {
      const error: IHttpError = {
        name: "Conflict",
        status: 409,
        message:
          "No se puede eliminar el proveedor, tiene stock registrado a su nombre.",
      };
      throw error;
    }

    await prisma.proveedores.delete({ where: { proveedor_id: supplierId } });
  }
}

export const supplierUserUseCase = new SupplierUser();
