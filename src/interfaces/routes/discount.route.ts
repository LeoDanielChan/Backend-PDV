import { Router } from "express";
import * as Controller from "../controllers/discount.controller";
const discountRouter = Router();

discountRouter.post("/", Controller.create);
discountRouter.put("/:id", Controller.update);
discountRouter.delete("/:id", Controller.remove);
discountRouter.get("/cliente/:clientId", Controller.getByClient);

export default discountRouter;