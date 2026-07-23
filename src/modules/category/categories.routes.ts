import { Router } from "express"
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { validate } from "../../middleware/validate";
import { createCategorySchema } from "./categories.validation";
import { categoryController } from "./categories.controller";

const router=Router()

router.get("/", categoryController.getAllCategories);

// Admin only
router.post("/",auth(Role.ADMIN),validate(createCategorySchema),categoryController.createCategory);
router.delete("/:id", auth(Role.ADMIN), categoryController.deleteCategory);

export const categoryRoutes=router 