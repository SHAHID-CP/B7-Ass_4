import { Router } from "express"
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { validate } from "../../middleware/validate";
import { paymentController } from "./payment.controller";
import { createCheckoutSessionSchema } from "./paymnet.validation";


const router=Router()

router.post("/create",auth(Role.TENANT),validate(createCheckoutSessionSchema),paymentController.createPaymentIntent);
router.get("/", auth(Role.TENANT,Role.ADMIN), paymentController.getPaymentHistory);
router.get("/:id", auth(Role.TENANT,Role.ADMIN),paymentController.getPaymentById); // access checked in service


export const paymentRoutes=router