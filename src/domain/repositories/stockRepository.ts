export interface StockRepository {
  getAllStock(branchId: number): Promise<any[]>;
  getStockById(stockId: number): Promise<any>;
  createStock(branchId: number, data: any): Promise<any>;
  updateStock(stockId: number, data: any): Promise<any>;
  deleteStock(stockId: number): Promise<void>;
}
