import * as z from "zod";

export const userRegistrationSchema = z.object({
  username: z.string(),
  email: z.email().optional(),
  password: z.string().min(8).max(16),
  fullName: z.string().optional(),
});
