import { Router } from "express";
import { getFranchises, createFranchise } from "../controllers/owner.controller";
import { authMiddleware } from "../middleware/authMiddleware";
import { authorize } from "../middleware/authorize";

const ownerRouter = Router()

ownerRouter.use(authMiddleware);
ownerRouter.get("/franchises", authorize([2]), getFranchises);
ownerRouter.post("/franchises", authorize([2]), createFranchise);

export default ownerRouter;
