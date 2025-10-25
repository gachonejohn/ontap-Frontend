
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

export const updateEmployeeSchema = z.object({
    department: z.number().int().positive().optional(),
    position: z.number().int().positive().optional(),
    role: z.number().int().positive().optional(),
});



export const UploadProfilePictureSchema = z.object({

  profile_picture: z
    .instanceof(File, { message: "Profile picture must be a valid file" })
    .refine(
      (file) =>
        ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
      { message: "Only JPEG/PNG images are allowed" }
    )
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "File size must be ≤ 5MB",
    }),
});



export const CreateEmployeeStatutorySchema = z.object({
  identifier: z.string().min(1, "Identifier is required"),
  document_type: z.number().int().positive().optional(),
  issue_date: z.string().nullable().optional(),
  expiry_date: z.string().optional(),
  file: z
    .instanceof(File, { message: "File must be a valid upload" })
    .optional(),
});

export const CreateEmployeeEducationSchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  level: z.string().min(1, "Level is required"),
  specialization: z.string().optional(),
  grade: z.string().optional(),
  document_type: z.number().int().positive().optional(),
  start_date: z.string().nullable().optional(),
  end_date: z.string().optional(),
  file: z
    .instanceof(File, { message: "File must be a valid upload" })
    .optional(),
});


export const updateEmployeePersonalInfoSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last is required"),
  date_of_birth: z.string().min(1, "Date of birth  is required"),
  gender: z.string().min(1, "Gender  is required"),
  phone_number: z.string().min(1, "Phone number is required"),
  email: z.string().min(1, "Email is required"),
});
