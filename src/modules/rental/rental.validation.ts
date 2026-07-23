import { z } from "zod";

export const createRentalRequestSchema = z.object({
  propertyId: z.string().uuid("Invalid property id"),
});

export const updateRentalStatusSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"], {
        message: "Status must be APPROVED or REJECTED" ,
  }),
});
