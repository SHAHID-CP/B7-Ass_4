import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { validate } from "../../middleware/validate";
import { createRentalRequestSchema } from "./rental.validation";
import { rentalController } from "./rental.controller";

const router=Router()

router.post("/",auth(Role.TENANT), validate(createRentalRequestSchema),rentalController.createRentalRequest);
router.get("/", auth(Role.TENANT), rentalController.getMyRentalRequests);
router.get("/:id", auth(Role.ADMIN,Role.LANDLORD,Role.TENANT),rentalController.getRentalRequestById);


export const rentalRoutes=router