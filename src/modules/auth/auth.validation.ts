import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"), 
  role: z.enum(["TENANT", "LANDLORD"], {
    message: "Role must be TENANT or LANDLORD", 
  }),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password is required"),
});


export const updateProfileSchema = z.object({
    name: z.string().optional(),
    phoneNumber: z.string().optional(),
    profileImage: z.string().url("Invalid image URL").optional(),
});