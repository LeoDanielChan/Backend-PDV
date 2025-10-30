import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const productRouter = Router();

productRouter.use(authMiddleware);
productRouter.get("/:branchId", getAllProducts);
productRouter.get("/:branchId/:id", getProductById);
productRouter.post("/:branchId", createProduct);
productRouter.put("/:branchId/:id", updateProduct);
productRouter.delete("/:branchId/:id", deleteProduct);

export default productRouter;
