import { z } from "zod";

export const CreateAttendancePolicySchema = z.object({
  rule_type: z.string().min(1, "Rule type is required"),
  rule_time: z
    .string()
    .min(1, "Rule time is required")
    .regex(
      /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/,
      "Invalid time format (use HH:MM or HH:MM:SS)"
    ),
  grace_minutes: z
    .number({
      required_error: "Grace minutes are required",
      invalid_type_error: "Grace minutes must be a number",
    })
    .min(0, "Grace minutes cannot be negative"),
  is_default: z.boolean().optional(),
  description:z.string().optional(),
});


