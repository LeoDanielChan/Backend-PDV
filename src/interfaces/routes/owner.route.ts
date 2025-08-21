import { Router } from "express";
import { getFranchises, createFranchise } from "../controllers/owner.controller";

const ownerRouter = Router()

ownerRouter.get("/franchises", getFranchises);
ownerRouter.post("/franchises", createFranchise);

export default ownerRouter;
