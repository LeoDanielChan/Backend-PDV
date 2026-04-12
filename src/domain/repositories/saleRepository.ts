import {
  ICreateSaleRequest,
  IAddPaymentRequest,
  ISaleDetailed,
  IPaymentResponse,
} from "../models/ISale";

export interface SaleRepository {
  // Generar la orden de venta (calcula descuentos y totales)
  createSale(data: ICreateSaleRequest): Promise<ISaleDetailed>;

  // Registrar un pago a una venta existente
  addPayment(data: IAddPaymentRequest): Promise<IPaymentResponse>;

  // Consultas
  getById(ventaId: number): Promise<ISaleDetailed | null>;
  getAllByBranch(branchId: number): Promise<ISaleDetailed[]>;
}
