import {
  IUnitCreateRequest,
  IUnitUpdateRequest,
  IUnitResponse,
} from "../models/IUnit";

export interface UnitRepository {
  getAllUnits(): Promise<IUnitResponse[]>;
  getUnitById(unitId: number): Promise<IUnitResponse | null>;
  createUnit(data: IUnitCreateRequest): Promise<IUnitResponse>;
  updateUnit(data: IUnitUpdateRequest): Promise<IUnitResponse>;
  deleteUnit(unitId: number): Promise<void>;
}
