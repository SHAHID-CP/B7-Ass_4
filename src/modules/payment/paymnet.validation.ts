import { z } from "zod";

export const createCheckoutSessionSchema = z.object({
  rentalRequestId: z.string().uuid("Invalid rental request id"),
});