import { Router } from "express";
import { updateProfile, changePassword, forgotPassword, resetPassword } from "@/interfaces/controllers/profile.controller";

const profileRouter = Router();

profileRouter.put("/update", updateProfile);
profileRouter.post("/change-password", changePassword);
profileRouter.post("/forgot-password", forgotPassword);
profileRouter.post("/reset-password", resetPassword);

export default profileRouter;
