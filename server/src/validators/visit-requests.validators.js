import { z } from "zod";

export const createVisitRequestSchema = z.object({
  message: z.string().max(500).optional().or(z.literal("")),
});

export const updateVisitRequestSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
});
