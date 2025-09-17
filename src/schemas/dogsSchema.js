import { z } from "zod";

export const createDogSchema = z.object({
  name: z.string().min(1, "Name is required"),
  firstDescription: z.string().min(1, "First description is required"),
  secondDescription: z.string().min(1, "Second description is required"),
});

export const updateDogSchema = createDogSchema.partial();
