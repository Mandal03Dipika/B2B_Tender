import { z } from "zod";

export const applyToTenderParamsSchema = z.object({
  tenderId: z.string().uuid("Invalid Tender ID"),
});

export const applyToTenderBodySchema = z.object({
  proposal: z.string().min(10, "Proposal must be at least 10 characters"),
});

export const tenderSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  deadline: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid deadline date",
  }),
  budget: z
    .number({ invalid_type_error: "Budget must be a number" })
    .min(0, "Budget must be non-negative"),
});

export const tenderQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
});
