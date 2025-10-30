import {
  ISupplierCreateRequest,
  ISupplierUpdateRequest,
  ISupplierResponse,
} from "../models/ISupplier";

export interface SupplierRepository {
  getAllSuppliers(branchId: number): Promise<ISupplierResponse[]>;
  getSupplierById(supplierId: number): Promise<ISupplierResponse | null>;
  createSupplier(data: ISupplierCreateRequest): Promise<ISupplierResponse>;
  updateSupplier(
    supplierId: number,
    data: ISupplierUpdateRequest
  ): Promise<ISupplierResponse>;
  deleteSupplier(supplierId: number): Promise<void>;
}
