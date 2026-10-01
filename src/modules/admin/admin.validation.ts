import { z } from "zod";

export const updateUserStatusSchema = z.object({
  status: z.enum(["ACTIVE", "BANNED",'SUSPENDED'], {
        message: "Status must be ACTIVE or BANNED" }),
});
