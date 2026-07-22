import { Router } from "express";
import { validate } from "../../middleware/validate";
import { registerSchema } from "./auth.validation";
import { authController } from "./auth.controller";

const router =Router();

router.post("/register", validate(registerSchema), authController.register);
// router.post("/login", validate(loginSchema), authController.login);

// router.post("/refresh-token", authController.refreshToken);
// router.post("/logout", authController.logout);

export const authRoutes=router;