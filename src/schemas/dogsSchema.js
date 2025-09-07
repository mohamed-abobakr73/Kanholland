import { z } from "zod";

export const createDogSchema = z.object({
  name: z.string().min(1, "Name is required"),
  breed: z.string().min(1, "Breed is required"),
  age: z.number().int().positive(),
  trainingLevel: z.number().int().min(0),
  certifications: z.string().optional(),
  specialization: z.string().optional(),
  isAvailable: z.boolean(),
  updatedBy: z.string().optional(),
  profileImageId: z.number().optional(),
});

export const updateDogSchema = createDogSchema.partial();
