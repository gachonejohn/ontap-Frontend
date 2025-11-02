import { z } from 'zod';

export const CreateBreakCategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

export const CreateBreakRuleSchema = z.object({
  name: z.string().min(1, 'Name is required'),

  max_breaks_per_day: z.number().min(1, 'Must be at least 1 break per day').default(2),

  max_total_break_minutes: z.number().min(1, 'Must be at least 1 minute').default(60),

  default_max_duration_minutes: z.number().min(1, 'Duration must be greater than 0').default(30),

  default_grace_period_minutes: z.number().min(0, 'Grace period cannot be negative').default(5),

  enforce_strictly: z.boolean().default(false),
});

export const CreateBreakTypePolicyAssignmentSchema = z.object({
  break_rule: z.number().int().positive(1, 'Break Rule is required'),
  break_type: z.number().int().positive(1, 'Break Type is required'),
  max_duration_minutes: z.number().min(1, 'Duration must be greater than 0').default(30),

  grace_period_minutes: z.number().min(0, 'Grace period cannot be negative').default(5),
  required: z.boolean().default(false),
});
export const CreateBreakSchema = z.object({
  break_type: z.number().int().positive(1, 'Break Type is required'),
  break_start: z
    .string({
      required_error: 'Break start time is required',
    })
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:mm)'),

  break_end: z
    .string({
      required_error: 'Break end time is required',
    })
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:mm)'),
});
