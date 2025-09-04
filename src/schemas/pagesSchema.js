import { z } from "zod";

export const createPageSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  backgroundVideoUrl: z.string().url().nullable().optional(),
});

// export const updatePageSchema = createPageSchema.partial().extend({
//   id: z.number().int(),
// });
