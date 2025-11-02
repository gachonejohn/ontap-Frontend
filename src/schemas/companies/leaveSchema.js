// @schemas/companies/leaveSchema.js
import { z } from "zod";

export const createLeavePolicySchema = z.object({
  name: z
    .string()
    .min(1, "Policy name is required")
    .max(100, "Policy name must be less than 100 characters"),

  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .or(z.literal("")),

  default_days: z.coerce
    .number()
    .min(0, "Default days must be a non-negative number"),

  can_carry_forward: z
    .boolean()
    .optional()
    .default(false),

  carry_forward_limit: z.coerce
    .number()
    .min(0, "Carry forward limit must be a non-negative number")
    .optional()
    .default(0),

  requires_document_after: z.coerce
    .number()
    .min(0, "Document requirement must be a non-negative number")
    .optional()
    .default(0),

  is_active: z
    .boolean()
    .optional()
    .default(true),
});

export const updateLeavePolicySchema = createLeavePolicySchema.partial();
