import { Router } from "express";
import { adminController } from "./admin.controller";
import { validate } from "../../middleware/validate";
import { updateUserStatusSchema } from "./admin.validation";


const router=Router()

router.get("/users", adminController.getAllUsers);
router.patch("/users/:id", validate(updateUserStatusSchema), adminController.updateUserStatus);
router.get("/properties", adminController.getAllProperties);
router.get("/rentals", adminController.getAllRentals);
router.get("/stats", adminController.getStats);


export const adminRoutes=router;