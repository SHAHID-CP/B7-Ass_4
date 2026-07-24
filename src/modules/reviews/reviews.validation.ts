import { z } from "zod";

export const createReviewSchema = z.object({
  propertyId: z.string().uuid("Invalid Property ID"),
  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot be more than 5"),
  comment: z
    .string()
    .min(3, "Comment must be at least 3 characters long")
    .max(500, "Comment cannot exceed 500 characters"),
});
