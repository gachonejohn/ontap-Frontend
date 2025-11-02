import { z } from 'zod';

export const CreateEmployeeContractSchema = z.object({
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format'),

  end_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format')
    .nullable()
    .optional(),
  basic_salary: z
    .string()
    .regex(/^\d+(\.\d+)?$/, 'Basic salary must be a valid decimal number')
    .nullable()
    .optional(),
  salary_currency: z.string().optional(),
  pay_frequency: z.string().optional(),
  work_location: z.string().optional(),
  reporting_to: z.string().optional(),
  status: z.string().optional(),
  contract_type: z.string().min(1, 'Contract type is required'),

  is_paid: z.boolean().optional(),
});

export const EmployeePaymentMethodSchema = z.object({
  method: z.string({
    required_error: 'Payment method is required',
  }),

  account_number: z
    .string()
    .max(50, 'Account number cannot exceed 50 characters')
    .nullable()
    .optional(),

  bank_name: z.string().max(100, 'Bank name cannot exceed 100 characters').nullable().optional(),

  mobile_number: z
    .string()
    .max(20, 'Mobile number cannot exceed 20 characters')
    .nullable()
    .optional(),

  notes: z.string().nullable().optional(),

  is_primary: z.boolean().nullable().optional(),
});

export const EmployeeEmergencyContactSchema = z.object({
  full_name: z
    .string()
    .min(1, 'Full name is required')
    .max(255, 'Full name cannot exceed 255 characters'),

  email: z.string().nullable().optional(),

  phone_number: z
    .string()
    .min(1, 'Phone number is required')
    .max(20, 'Phone number cannot exceed 20 characters'),

  relationship: z.string({
    required_error: 'Relationship is required',
  }),

  address: z.string().nullable().optional(),
});
