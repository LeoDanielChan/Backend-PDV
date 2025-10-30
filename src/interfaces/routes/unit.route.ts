import { Router } from "express";
import {
  getAllUnits,
  getUnitById,
  createUnit,
  updateUnit,
  deleteUnit,
} from "../controllers/unit.controller";
import { authMiddleware } from "../middleware/authMiddleware";
import { authorize } from "../middleware/authorize";

const unitRouter = Router();

unitRouter.use(authMiddleware);
unitRouter.get("/", getAllUnits);
unitRouter.get("/:id", getUnitById);
unitRouter.post("/", authorize([2]), createUnit);
unitRouter.put("/:id", authorize([2]), updateUnit);
unitRouter.delete("/:id", authorize([2]), deleteUnit);

export default unitRouter;
