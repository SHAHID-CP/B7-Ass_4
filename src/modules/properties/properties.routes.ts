import { Router } from "express";
import { propertyController } from "./propertis.controller";
import { validateQuery } from "../../middleware/validate";
import { propertyQuerySchema } from "./properties.validation";


const router=Router()

router.get("/",validateQuery(propertyQuerySchema),propertyController.getAllProperties);
router.get("/:id", propertyController.getPropertyById);

export const publicPropertyRoutes=router;