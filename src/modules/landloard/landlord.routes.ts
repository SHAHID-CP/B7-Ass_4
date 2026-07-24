import { Router } from "express";
import { validate } from "../../middleware/validate";
import { createPropertySchema, updatePropertySchema, updateRentalStatusSchema } from "./landlord.validation";
import { landLordController } from "./landlord.controller";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";

const router = Router();
router.get("/requests",landLordController.getMyProperties);
router.post("/properties",validate(createPropertySchema),landLordController.createProperty);
router.put("/properties/:id",validate(updatePropertySchema),landLordController.updateProperty);
router.delete("/properties/:id", landLordController.deleteProperty);
router.patch("/requests/:id", validate(updateRentalStatusSchema),landLordController.updateRentalStatus);
router.get("/tenant-history/:tenantId",auth(Role.LANDLORD, Role.ADMIN),landLordController.getTenantHistory);


export const landlordPropertyRoutes=router