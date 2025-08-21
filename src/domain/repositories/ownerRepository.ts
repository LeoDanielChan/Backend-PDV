export interface OwnerRepository {
  getUserFranchises(userId: number): Promise<any[]>;
  createFranchise(userId: number, franchiseData: any): Promise<any>;
}
