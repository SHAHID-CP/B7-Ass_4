import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { userController } from "./user.controller";

const router = Router();

router.get("/me",
auth(Role.ADMIN, Role.LANDLORD, Role.TENANT),
userController.getMyProfile)

export const userRoutes = router;