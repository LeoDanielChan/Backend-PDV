import { Router } from "express";
import { getAllBranches, getBranchById, createBranch, updateBranch, deleteBranch } from "../controllers/branch.controller";
import { authMiddleware } from "../middleware/authMiddleware";
import { authorize } from "../middleware/authorize";

const branchRouter = Router();

branchRouter.use(authMiddleware);
branchRouter.get("/", authorize([2]), getAllBranches);
branchRouter.get("/:id", authorize([2]), getBranchById);
branchRouter.post("/", authorize([2]), createBranch);
branchRouter.put("/:id", authorize([2]), updateBranch);
branchRouter.delete("/:id", authorize([2]), deleteBranch);

export default branchRouter;
