import { z } from "zod";

export const createEmployeeSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last is required"),
  date_of_birth: z.string().min(1, "Date of birth  is required"),
  gender: z.string().min(1, "Gender  is required"),
  phone_number: z.string().min(1, "Phone number is required"),
  email: z.string().min(1, "Email is required"),
  employee_no: z.string().optional(),
  role_id: z.number().int().positive().optional(),
  department_id: z.number().int().positive().optional(),
  position_id: z.number().int().positive().optional(),
});
