import { z } from "zod";

export const getAccessTokenSchema = z.object({
  refreshToken: z.string(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
