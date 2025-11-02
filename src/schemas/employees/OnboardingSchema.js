// Schema definitions

import { z } from 'zod';

export const personalDetailsSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  phone_number: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Invalid email format'),
  employee_no: z.string().optional(), // Fixed typo: was "employee_noexport"
});

export const nextOfKinSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  phone_number: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  relationship: z.string().min(1, 'Relationship is required'),
  address: z.string().optional(),
});

export const emergencyContactSchema = z.object({
  name: z.string().min(1, 'Contact name is required'), // Changed from full_name to name
  phone: z.string().min(1, 'Phone number is required'), // Changed from phone_number to phone
  relationship: z.string().min(1, 'Relationship is required'),
  address: z.string().optional(),
});

export const paymentMethodSchema = z.object({
  method: z.string().min(1, 'Payment method is required'), // Fixed description
  account_number: z.string().optional(),
  bank_name: z.string().optional(),
  mobile_number: z.string().optional(),
  notes: z.string().optional(),
  is_primary: z.boolean().optional(), // Fixed: was "boolean"
});

export const contractSchema = z.object({
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().optional(),
  work_location: z.string().min(1, 'Work location is required'),
  basic_salary: z.number().positive('Salary must be positive').optional(),
  salary_currency: z.string().optional(),
  contract_type: z.string().optional(),
  reporting_to: z.string().optional(),
});

export const documentSchema = z.object({
  document_type: z.string().min(1, 'Document type is required'),
  file: z.any().optional(),
  description: z.string().optional(),
  expiry_date: z.string().optional(),
});

export const propertySchema = z.object({
  property_id: z.number().positive('Property is required').optional(),
  issue_date: z.string().optional(),
  return_date: z.string().optional(),
  condition_on_issue: z.string().optional(),
  condition_on_return: z.string().optional(),
});

export const completeEmployeeSchema = z.object({
  // Personal details
  ...personalDetailsSchema.shape,
  department_id: z.number().positive('Department is required').optional(),
  position_id: z.number().positive('Position is required').optional(),
  role_id: z.number().positive('Role is required').optional(),

  // Single objects (not arrays)
  next_of_kin: nextOfKinSchema.optional(),
  emergency_contact: emergencyContactSchema.optional(), // Changed from "emergency" to "emergency_contact"
  contract: contractSchema.optional(),
  payment: paymentMethodSchema.optional(), // Changed from "payment_method" to "payment"
  property: propertySchema.optional(),

  // Only documents remain as array (handled separately in component)
  documents: z.array(documentSchema).optional(),
});
