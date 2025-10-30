import { Router } from "express";
import {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supplier.controller";
import { authMiddleware } from "../middleware/authMiddleware";
import { authorize } from "../middleware/authorize";

const supplierRouter = Router();

supplierRouter.use(authMiddleware);

supplierRouter.get("/:branchId", authorize([2]), getAllSuppliers);
supplierRouter.get("/:branchId/:id", authorize([2]), getSupplierById);
supplierRouter.post("/:branchId", authorize([2]), createSupplier);
supplierRouter.put("/:branchId/:id", authorize([2]), updateSupplier);
supplierRouter.delete("/:branchId/:id", authorize([2]), deleteSupplier);

export default supplierRouter;
