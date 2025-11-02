import { z } from 'zod';

export const createTemplateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  template_type: z.string().min(1, 'Type is required'),
  department: z
    .number({
      required_error: 'Department is required',
      invalid_type_error: 'Department is required',
    })
    .int()
    .positive('Department is required'),
  description: z.string().optional(),
  duration_in_days: z.coerce.number().min(1, 'Duration in days must be at least 1'),
});

export const attachTemplateStepSchema = z.object({
  onboarding_step: z.number().int().positive('Step is required'),
  step_order: z.coerce.number().min(1, 'Step Order is required'),
});

export const createStepSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  priority: z.string().min(1, 'Priority is required'),
  assignee: z
    .number({
      required_error: 'Assignee is required',
      invalid_type_error: 'Assignee is required',
    })
    .int()
    .positive('Assignee is required'),
  description: z.string().optional(),
  duration_in_days: z.coerce.number().min(1, 'Duration in days must be at least 1'),
});

export const onboardEmployeeSchema = z.object({
  status: z.string().optional(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format'),
  employee: z
    .number({
      required_error: 'Employee is required',
      invalid_type_error: 'Employee is required',
    })
    .int()
    .positive('Employee is required'),
  template: z
    .number({
      required_error: 'Employee is required',
      invalid_type_error: 'Employee is required',
    })
    .int()
    .positive('Employee is required'),
  coordinator: z
    .number({
      required_error: 'Coordinator is required',
      invalid_type_error: 'Coordinator is required',
    })
    .int()
    .positive('Coordinator is required'),
});
