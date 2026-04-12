import { Router } from "express";
import {
//  getAllStock,
//  getStockById,
//  createStock,
//  updateStock,
//  deleteStock,
  createEntry,
  processMeat,
  getAll,
} from "../controllers/stock.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const stockRouter = Router();

stockRouter.use(authMiddleware);
//stockRouter.get("/:branchId/", getAllStock);
//stockRouter.get("/:branchId/:id", getStockById);
//stockRouter.post("/:branchId", createStock);
//stockRouter.put("/:branchId/:id", updateStock);
//stockRouter.delete("/:branchId/:id", deleteStock);

// Ruta para entrada de mercancía (Compra)
stockRouter.post("/entrada", createEntry);

// Ruta para procesar carne (Despiece)
stockRouter.post("/despiece", processMeat);

// Ruta para ver stock de una sucursal
stockRouter.get("/sucursal/:branchId", getAll);

export default stockRouter;
