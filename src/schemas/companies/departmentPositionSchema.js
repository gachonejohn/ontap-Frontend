import { z } from 'zod';

export const createDepartmentSchema = z.object({
  name: z.string().min(1, 'Department name is required'),
});

export const createPositionSchema = z.object({
  title: z.string().min(1, 'Position name is required'),
  department: z.number().int().positive('Department is required'), 
});