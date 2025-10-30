import {
  ICreateCategoryRequest,
  IUpdateCategoryRequest,
  ICategoryResponse,
} from "../models/ICategory";

export interface CategoryRepository {
  createCategory(data: ICreateCategoryRequest): Promise<ICategoryResponse>;
  updateCategory(data: IUpdateCategoryRequest): Promise<ICategoryResponse>;
  listCategoriesBySucursal(sucursal_id: number): Promise<ICategoryResponse[]>;
}
