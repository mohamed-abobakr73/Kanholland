import { z } from "zod";

export const createSectionSchema = z.object({
  pageId: z.coerce.number(), // 👈 converts "1" → 1
  title: z.string().optional(),
  content: z.string().optional(),
  orderIndex: z.coerce.number().optional().default(0),
});

export const updateSectionSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  orderIndex: z.coerce.number().optional(),
});
