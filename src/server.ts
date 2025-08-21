import app from "./app";
import { env } from "@/config/env";
import ownerRouter from "./interfaces/routes/owner.route";
import authRouter from "./interfaces/routes/auth.route";
import branchRouter from "./interfaces/routes/branch.route";
import employeeRouter from "./interfaces/routes/employee.route";
import productRouter from "./interfaces/routes/product.route";
import stockRouter from "./interfaces/routes/stock.route";

app.use("/owners", ownerRouter);
app.use("/auth", authRouter);
app.use("/branches", branchRouter);
app.use("/employees", employeeRouter);
app.use("/products", productRouter);
app.use("/stocks", stockRouter);

app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
})

