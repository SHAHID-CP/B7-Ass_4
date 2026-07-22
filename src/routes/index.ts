import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes";


const router = Router();

router.use("/auth", authRoutes);
// router.use("/properties", publicPropertyRoutes);
// router.use("/landlord/properties", landlordPropertyRoutes);
// router.use("/categories", categoryRoutes);
// router.use("/rentals", rentalRoutes);
// router.use("/landlord/requests", landlordRequestRoutes);
// router.use("/payments", paymentRoutes);
// router.use("/reviews", reviewRoutes);
// router.use("/admin", adminRoutes);

export const routes=router ;
