import { Router } from "express";
import * as SaleController from "../controllers/sale.controller";

const saleRouter = Router();

// Crear una nueva venta (Orden)
saleRouter.post("/", SaleController.createSale);

// Registrar un pago a una venta existente
saleRouter.post("/pago", SaleController.addPayment);

// Ver detalle de una venta
saleRouter.get("/:id", SaleController.getSale);

// Ver historial de ventas por sucursal
saleRouter.get("/sucursal/:branchId", SaleController.getByBranch);

export default saleRouter;