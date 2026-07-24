import { Router } from "express"
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { validate } from "../../middleware/validate";
import { createReviewSchema } from "./reviews.validation";
import { reviewController } from "./reviews.controller";


const router=Router()

router.post("/", auth(Role.TENANT),validate(createReviewSchema),reviewController.createReview);
router.get("/property/:propertyId", reviewController.getPropertyReviews);
router.get("/landlord", auth(Role.LANDLORD), reviewController.getLandlordReviews);
router.get("/admin", auth(Role.ADMIN), reviewController.getAllReviews);


export const reviewRoutes=router