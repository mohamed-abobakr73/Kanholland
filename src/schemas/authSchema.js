import { z } from "zod";

export const getAccessTokenSchema = z.object({
  refreshToken: z.string(),
});

export const createAdminSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(3),
  role: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
