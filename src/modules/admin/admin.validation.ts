import { z } from "zod";

export const updateUserStatusSchema = z.object({
  status: z.enum(["ACTIVE", "BANNED"], {
        message: "Status must be ACTIVE or BANNED" }),
});
