export interface BranchRepository {
  getAllBranches(id_franquicia: number): Promise<any[]>;
  getBranchById(id_franquicia: number, branchId: number): Promise<any>;
  createBranch(data: any): Promise<any>;
  updateBranch(branchId: number, data: any): Promise<any>;
  deleteBranch(branchId: number): Promise<void>;
}
