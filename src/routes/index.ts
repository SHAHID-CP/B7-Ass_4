import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { landlordPropertyRoutes } from "../modules/landloard/landlord.routes";
import { auth } from "../middleware/auth";
import { Role } from "../../generated/prisma/enums";
import { categoryRoutes } from "../modules/category/categories.routes";
import { rentalRoutes } from "../modules/rental/rental.routes";


const router = Router();

router.use("/auth", authRoutes);
// router.use("/properties", publicPropertyRoutes);
router.use("/landlord",auth(Role.LANDLORD) ,landlordPropertyRoutes);
router.use("/categories", categoryRoutes);
router.use("/rentals", rentalRoutes);
// router.use("/landlord/requests", landlordRequestRoutes);
// router.use("/payments", paymentRoutes);
// router.use("/reviews", reviewRoutes);
// router.use("/admin", adminRoutes);

export const routes=router ;
