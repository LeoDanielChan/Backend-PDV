import { Router } from "express";
import {
  getAllStock,
  getStockById,
  createStock,
  updateStock,
  deleteStock,
} from "../controllers/stock.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const stockRouter = Router();

stockRouter.use(authMiddleware);
stockRouter.get("/:branchId/", getAllStock);
stockRouter.get("/:branchId/:id", getStockById);
stockRouter.post("/:branchId", createStock);
stockRouter.put("/:branchId/:id", updateStock);
stockRouter.delete("/:branchId/:id", deleteStock);

export default stockRouter;
