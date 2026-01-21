import { z } from "zod";

export const createPetPostSchema = z.object({
  type: z.enum(["ADOPTION", "FOUND_LOST"]),
  species: z.enum(["DOG", "CAT"]),
  name: z.string().min(1).max(60).optional().or(z.literal("")),
  color: z.string().min(2).max(40),
  ageMonths: z.number().int().min(0).max(360),
  weightKg: z.number().min(0).max(200),
  sex: z.enum(["M", "F", "UNKNOWN"]).optional().default("UNKNOWN"),
  size: z.enum(["SMALL", "MEDIUM", "LARGE"]).optional(),
  neighborhoodId: z.string().uuid(),
  description: z.string().min(10).max(2000),
  eventDate: z.string().optional().nullable(), // yyyy-mm-dd (validaremos no controller)
});

export const updatePetPostSchema = createPetPostSchema.partial();
