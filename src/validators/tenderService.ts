import { z } from "zod";

export const tenderServiceParamsSchema = z.object({
  tenderId: z.string().uuid("Invalid Tender ID"),
  serviceId: z.string().uuid("Invalid Service ID").optional(),
});

export const linkServicesSchema = z.object({
  serviceIds: z
    .array(z.string().uuid("Invalid service ID"))
    .min(1, "At least one service ID is required"),
});
