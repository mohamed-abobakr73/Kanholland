import { z } from "zod";

export const createPageSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  backgroundVideoUrl: z.string().url().nullable().optional(),
  backgroundImages: z
    .array(
      z.object({
        imageUrl: z.string().url(),
        orderIndex: z.number().int(),
      })
    )
    .optional(),
  sections: z
    .array(
      z.object({
        title: z.string().min(1),
        desc: z.string().optional(),
        backgroundImage: z.string().nullable().optional(),
        backgroundVideo: z.string().nullable().optional(),
        orderIndex: z.number().int(),
        media: z
          .array(
            z.object({
              fileName: z.string(),
              fileUrl: z.string().url(),
              fileType: z.string(),
            })
          )
          .optional(),
      })
    )
    .optional(),
});

export const updatePageSchema = createPageSchema.partial().extend({
  id: z.number().int(),
});
