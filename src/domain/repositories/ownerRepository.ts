import { IOwnerRes } from "../models/IOwner";

export interface OwnerRepository {
  getUserFranchises(userId: number): Promise<IOwnerRes[]>;
  createFranchise(userId: number, franchiseData: any): Promise<any>;
}
