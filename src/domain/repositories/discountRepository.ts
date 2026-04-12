import { IDiscountCreateRequest, IDiscountUpdateRequest, IDiscountDetailed } from "../models/IDiscount";
import { descuentos } from "@/infrastructure/database/generated/prisma";

export interface DiscountRepository {
  create(data: IDiscountCreateRequest): Promise<IDiscountDetailed>;
  update(id: number, data: IDiscountUpdateRequest): Promise<descuentos>;
  delete(id: number): Promise<void>;
  getAllByClient(clientId: number): Promise<IDiscountDetailed[]>;
  getById(id: number): Promise<IDiscountDetailed | null>;
}

