import { z } from 'zod';


export const singlePayrollSchema = z.object({
  employee_no: z.string().min(1, 'Employee no is required'),
  period: z.number().int().positive(1, 'Payroll Period is required'),
});

export const BulkPayrollSchema = z.object({
  period: z.number().int().positive(1, 'Payroll Period is required'),
});

export const createAdjustmentSchema =  z.object({
  adjustment_type: z.string().min(1, 'Adjustment type no is required'),
  reason: z.string().min(1, "Reason required for audit purposes"),
  employee_no: z.string().min(1, 'Employee no is required'),
  amount: z.coerce.number().int().positive(1,"Amount is required"),
  period: z.number().int().positive(1, 'Payroll Period is required'),
});
export const createBulkAdjustmentSchema =  z.object({
  adjustment_type: z.string().min(1, 'Adjustment type no is required'),
  period: z.number().int().positive(1, 'Payroll Period is required'),
  reason: z.string().min(1, "Reason required for audit purposes"),
  amount: z.coerce.number().int().positive(1,"Amount is required")

});
export const createDeptAdjustmentSchema =  z.object({
  adjustment_type: z.string().min(1, 'Adjustment type no is required'),
  period: z.coerce.number().int().positive(1, 'Payroll Period is required'),
  department: z.coerce.number().int().positive(1, 'Department is required'),
  reason: z.string().min(1, "Reason required for audit purposes"),
  amount: z.coerce.number().int().positive(1,"Amount is required")
});


export const rejectAdjustmentSchema =  z.object({
 
  rejection_reason: z.string().min(1, "Reason required for audit purposes"),
 
});