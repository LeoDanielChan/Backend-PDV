import { Router } from "express";
import { getAllBranches, getBranchById, createBranch, updateBranch, deleteBranch } from "../controllers/branch.controller";

const branchRouter = Router();

branchRouter.get("/", getAllBranches);
branchRouter.get("/:id", getBranchById);
branchRouter.post("/", createBranch);
branchRouter.put("/:id", updateBranch);
branchRouter.delete("/:id", deleteBranch);

export default branchRouter;
