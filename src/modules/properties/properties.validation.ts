import { z } from "zod";

export const createPropertySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(2, "Location is required"),
  price: z.number().positive("Price must be a positive number"),
  categoryId: z.string().uuid("Invalid category id"),
});

export const updatePropertySchema = createPropertySchema.partial().extend({
  isAvailable: z.boolean().optional(),
});

export const propertyQuerySchema = z.object({
  location: z.string().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  categoryId: z.string().uuid().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});
