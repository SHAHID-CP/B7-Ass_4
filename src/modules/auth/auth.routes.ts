import { Router } from "express";
import { validate } from "../../middleware/validate";
import { loginSchema, registerSchema } from "./auth.validation";
import { authController } from "./auth.controller";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";

const router =Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);

router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authController.logout);

router.get("/me",
auth(Role.ADMIN, Role.LANDLORD, Role.TENANT),
authController.getMyProfile)

export const authRoutes=router;