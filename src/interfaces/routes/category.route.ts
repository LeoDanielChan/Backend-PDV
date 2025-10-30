import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  createCategory,
  updateCategory,
  listCategoriesBySucursal,
  getCategoryById,
} from "../controllers/category.controller";
import { authorize } from "../middleware/authorize";

const categoryRouter = Router();

categoryRouter.use(authMiddleware);
categoryRouter.post("/", authorize([2]), createCategory);
categoryRouter.put("/:id", authorize([2]), updateCategory);
categoryRouter.get("/byCategory", authorize([2]), getCategoryById);
categoryRouter.get("/bySucursal", authorize([2]), listCategoriesBySucursal);

export default categoryRouter;
