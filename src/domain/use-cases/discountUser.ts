import { DiscountRepository } from "../repositories/discountRepository";
import { prisma } from "@/config/prismaClient";
import { IDiscountCreateRequest, IDiscountUpdateRequest, IDiscountDetailed } from "../models/IDiscount";
import { IHttpError } from "../models/IAuth";

export class DiscountUser implements DiscountRepository {
  
  async create(data: IDiscountCreateRequest): Promise<IDiscountDetailed> {
    // Verificar si ya existe un descuento para ese cliente y producto
    const exists = await prisma.descuentos.findFirst({
      where: {
        cliente_id: data.cliente_id,
        producto_id: data.producto_id,
        deleted_at: null
      }
    });

    if (exists) {
      throw { status: 409, message: "Este cliente ya tiene un descuento activo para este producto" };
    }

    const newDiscount = await prisma.descuentos.create({
      data: {
        ...data,
        created_at: new Date()
      },
      include: {
        clientes: true,
        productos: true
      }
    });

    return newDiscount as unknown as IDiscountDetailed;
  }

  async update(id: number, data: IDiscountUpdateRequest): Promise<any> {
    const exists = await prisma.descuentos.findUnique({ where: { descuento_id: id } });
    if (!exists) throw { status: 404, message: "Descuento no encontrado" };

    return await prisma.descuentos.update({
      where: { descuento_id: id },
      data: {
        ...data,
        update_at: new Date()
      }
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.descuentos.update({
      where: { descuento_id: id },
      data: { deleted_at: new Date() } // Soft Delete
    });
  }

  async getAllByClient(clientId: number): Promise<IDiscountDetailed[]> {
    return await prisma.descuentos.findMany({
      where: { cliente_id: clientId, deleted_at: null },
      include: { clientes: true, productos: true }
    }) as unknown as IDiscountDetailed[];
  }

  async getById(id: number): Promise<IDiscountDetailed | null> {
    return await prisma.descuentos.findUnique({
      where: { descuento_id: id },
      include: { clientes: true, productos: true }
    }) as unknown as IDiscountDetailed | null;
  }
}