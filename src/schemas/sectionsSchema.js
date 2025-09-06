import z from "zod";

export const createSectionSchema = z.object({
  pageId: z.coerce.number(),
  title: z.string().optional(),
  content: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) => (typeof val === "string" ? [val] : val)),
});

export const updateSectionSchema = z.object({
  title: z.string().optional(),
  content: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) => (typeof val === "string" ? [val] : val)),
});
