import { Router } from "express";
import { getAllStock, getStockById, createStock, updateStock, deleteStock } from "../controllers/stock.controller";

const stockRouter = Router();

stockRouter.get("/branches/:branchId/stock", getAllStock);
stockRouter.get("/branches/:branchId/stock/:id", getStockById);
stockRouter.post("/branches/:branchId/stock", createStock);
stockRouter.put("/branches/:branchId/stock/:id", updateStock);
stockRouter.delete("/branches/:branchId/stock/:id", deleteStock);

export default stockRouter;
