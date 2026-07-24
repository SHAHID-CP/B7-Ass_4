import { Router } from "express";
import { validate } from "../../middleware/validate";
import { createPropertySchema, updatePropertySchema, updateRentalStatusSchema } from "./landlord.validation";
import { landLordController } from "./landlord.controller";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";

const router = Router();
router.get("/requests",auth(Role.LANDLORD),landLordController.getMyProperties);
router.post("/properties",auth(Role.LANDLORD),validate(createPropertySchema),landLordController.createProperty);
router.put("/properties/:id",auth(Role.LANDLORD),validate(updatePropertySchema),landLordController.updateProperty);
router.delete("/properties/:id",auth(Role.LANDLORD), landLordController.deleteProperty);
router.patch("/requests/:id",auth(Role.LANDLORD), validate(updateRentalStatusSchema),landLordController.updateRentalStatus);
router.get("/tenant-history/:tenantId",auth(Role.LANDLORD, Role.ADMIN),landLordController.getTenantHistory);


export const landlordPropertyRoutes=router