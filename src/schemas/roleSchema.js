import { z } from 'zod';

export const createRoleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export const assignRoleSchema = z.object({
  role: z.number().int().positive(1, 'Role is required'),
  is_primary: z.boolean().nullable().optional(),
});
