import { Router } from "express";
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../controllers/product.controller";

const productRouter = Router();

productRouter.get("/branches/:branchId/products", getAllProducts);
productRouter.get("/branches/:branchId/products/:id", getProductById);
productRouter.post("/branches/:branchId/products", createProduct);
productRouter.put("/branches/:branchId/products/:id", updateProduct);
productRouter.delete("/branches/:branchId/products/:id", deleteProduct);

export default productRouter;
