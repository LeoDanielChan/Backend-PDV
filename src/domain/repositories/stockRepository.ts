import {
  IStockResponse,
  IStockDetailedResponse,
  IPrimaryStockCreateRequest,
  IDerivedStockCreateRequest,
  IStockUpdateRequest,
  IStockEntryRequest,
  IStockDetailed,
  IStockProcessRequest,
  IStockProcessResponse,
} from "../models/IStock";

export type IStockCreateRequest =
  | IPrimaryStockCreateRequest
  | IDerivedStockCreateRequest;

export interface StockRepository {
  //getAllStock(branchId: number): Promise<IStockResponse[]>;
//
  //getStockById(stockId: number): Promise<IStockDetailedResponse | null>;
//
  //createStock(
  //  branchId: number,
  //  data: IStockCreateRequest
  //): Promise<IStockDetailedResponse>;
//
  //updateStock(
  //  stockId: number,
  //  data: IStockUpdateRequest
  //): Promise<IStockResponse>;
  //
  //deleteStock(stockId: number): Promise<void>;

  createEntry(data: IStockEntryRequest): Promise<IStockDetailed>;
  
  // Procesar despiece (Logica compleja)
  processMeat(data: IStockProcessRequest): Promise<IStockProcessResponse>;
  
  // Lecturas
  getAllByBranch(branchId: number): Promise<IStockDetailed[]>;
  getById(stockId: number): Promise<IStockDetailed | null>;
}
