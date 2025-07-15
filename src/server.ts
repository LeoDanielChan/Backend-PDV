import app from "./app";
import { env } from "@/config/env";
import userRouter from "./interfaces/routes/user.route";
import authRouter from "./interfaces/routes/auth.route";

const PORT = env.PORT;

app.use("/users", userRouter);
app.use("/auth", authRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

