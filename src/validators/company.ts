import { z } from "zod";

export const companySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  industry: z.string().min(2, "Industry is required"),
  description: z.string().optional(),
  logo_url: z.string().optional(),
});

export const searchCompaniesSchema = z.object({
  name: z.string().optional(),
  industry: z.string().optional(),
  service: z.string().optional(),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
});
