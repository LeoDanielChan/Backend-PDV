export interface ProductRepository {
  getAllProducts(branchId: number): Promise<any[]>;
  getProductById(productId: number): Promise<any>;
  createProduct(branchId: number, data: any): Promise<any>;
  updateProduct(productId: number, data: any): Promise<any>;
  deleteProduct(productId: number): Promise<void>;
}
