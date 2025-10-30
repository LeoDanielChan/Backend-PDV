import {
  IProductResponse,
  IProductDetailedResponse,
  IProductCreateRequest,
  IProductUpdateRequest,
} from "../models/IProduct";

export interface ProductRepository {
  getAllProducts(branchId: number): Promise<IProductResponse[]>;
  getProductById(productId: number): Promise<IProductDetailedResponse | null>;
  createProduct(
    branchId: number,
    data: IProductCreateRequest
  ): Promise<IProductDetailedResponse>;
  updateProduct(
    productId: number,
    data: IProductUpdateRequest
  ): Promise<IProductResponse>;
  deleteProduct(productId: number): Promise<void>;
}
