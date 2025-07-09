import app from "./app";
import { env } from "@/config/env";

const PORT = env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

app.get("/", (req, res) => {
    res.send("Backend is running");
})

