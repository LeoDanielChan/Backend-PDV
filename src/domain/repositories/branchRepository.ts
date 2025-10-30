import {
  IBranchResponse,
  IBranchDetailedResponse,
  IBranchCreateRequest,
  IBranchUpdateRequest,
} from "../models/IBranch";

export interface BranchRepository {
  getAllBranches(userId: number): Promise<IBranchResponse[]>;
  getBranchById(userId: number, branchId: number): Promise<IBranchDetailedResponse | null>;
  createBranch(data: IBranchCreateRequest): Promise<IBranchDetailedResponse>;
  updateBranch(branchId: number, data: IBranchUpdateRequest): Promise<IBranchResponse>;
  deleteBranch(branchId: number): Promise<void>;
}
