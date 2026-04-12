import app from "./app";
import { env } from "@/config/env";
import ownerRouter from "./interfaces/routes/owner.route";
import authRouter from "./interfaces/routes/auth.route";
import branchRouter from "./interfaces/routes/branch.route";
import employeeRouter from "./interfaces/routes/employee.route";
import productRouter from "./interfaces/routes/product.route";
import stockRouter from "./interfaces/routes/stock.route";
import categoryRouter from "./interfaces/routes/category.route";
import unitRouter from "./interfaces/routes/unit.route";
import supplierRouter from "./interfaces/routes/supplier.route";
import discountRouter from "./interfaces/routes/discount.route";
import saleRouter from "./interfaces/routes/sale.route";

app.use("/branches/discounts", discountRouter);
app.use("/owners", ownerRouter);
app.use("/auth", authRouter);
app.use("/branches", branchRouter);
app.use("/units", unitRouter);
app.use("/branches/categories", categoryRouter);
app.use("/branches/suppliers", supplierRouter);
app.use("/branches/products", productRouter);
app.use("/branches/stock", stockRouter);
app.use("/branches/employees", employeeRouter);
app.use("/branches/sales", saleRouter);

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});
