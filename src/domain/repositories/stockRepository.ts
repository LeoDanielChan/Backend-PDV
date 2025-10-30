import {
  IStockResponse,
  IStockDetailedResponse,
  IPrimaryStockCreateRequest,
  IDerivedStockCreateRequest,
  IStockUpdateRequest,
} from "../models/IStock";

export type IStockCreateRequest =
  | IPrimaryStockCreateRequest
  | IDerivedStockCreateRequest;

export interface StockRepository {
  getAllStock(branchId: number): Promise<IStockResponse[]>;

  getStockById(stockId: number): Promise<IStockDetailedResponse | null>;

  createStock(
    branchId: number,
    data: IStockCreateRequest
  ): Promise<IStockDetailedResponse>;

  updateStock(
    stockId: number,
    data: IStockUpdateRequest
  ): Promise<IStockResponse>;
  
  deleteStock(stockId: number): Promise<void>;
}
