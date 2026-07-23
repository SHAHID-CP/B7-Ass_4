import { Router } from "express";
import { validate } from "../../middleware/validate";
import { createPropertySchema, updatePropertySchema } from "./landlord.validation";
import { landLordController } from "./landlord.controller";

const router = Router();
router.get("/requests",landLordController.getMyProperties);
router.post("/properties",validate(createPropertySchema),landLordController.createProperty);
router.put("/properties/:id",validate(updatePropertySchema),landLordController.updateProperty);
router.delete("/properties/:id", landLordController.deleteProperty);
// router.patch("/requests/:id", validate(updatePropertySchema),landLordController.patchProperty);


export const landlordPropertyRoutes=router