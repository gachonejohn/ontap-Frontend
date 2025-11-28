import { z } from 'zod';

export const personalInfoSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  street_address: z.string().min(2, 'Last name must be at least 2 characters'),
  city: z.string().min(2, 'City is required'),
  postal_code: z.string().min(2, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
  email: z.string().email('Invalid email address'),
  phone_number: z.string().min(10, 'Phone number must be at least 10 digits'),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  gender:  z.string().min(1, 'Gender is required'),
  nationality: z.string().min(2, 'Nationality is required'),
  role_id: z.number().int().positive().optional(),
  department_id: z.number().int().positive().optional(),
  position_id: z.number().int().positive().optional(),
  marital_status: z.string().optional(),
  employee_no: z.string().optional(),
  profile_picture: z
    .union([
      z.instanceof(File, { message: 'Profile picture must be a valid file' })
        .refine((file) => ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type), {
          message: 'Only JPEG/PNG images are allowed',
        })
        .refine((file) => file.size <= 5 * 1024 * 1024, {
          message: 'File size must be ≤ 5MB',
        }),
      z.undefined()
    ]),
  employee_no: z.string().optional(),
});

export const addressSchema = z.object({
  street: z.string().min(5, 'Street address must be at least 5 characters'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State/Province is required'),
  zipCode: z.string().min(4, 'Zip/Postal code is required'),
  country: z.string().min(2, 'Country is required'),
  permanentAddress: z.string().optional()
});

export const employmentSchema = z.object({
  employeeId: z.string().min(3, 'Employee ID must be at least 3 characters'),
  department: z.string().min(1, 'Department is required'),
  position: z.string().min(2, 'Position is required'),
  joiningDate: z.string().min(1, 'Joining date is required'),
  employmentType: z.enum(['full-time', 'part-time', 'contract', 'intern'], {
    errorMap: () => ({ message: 'Please select employment type' })
  }),
  reportingManager: z.string().min(2, 'Reporting manager is required'),
  salary: z.string().min(1, 'Salary is required')
});

export const documentsSchema = z.object({
  hasIdentityProof: z.boolean().refine(val => val === true, {
    message: 'Identity proof is required'
  }),
  hasAddressProof: z.boolean().refine(val => val === true, {
    message: 'Address proof is required'
  }),
  hasEducationCertificates: z.boolean().refine(val => val === true, {
    message: 'Education certificates are required'
  }),
  hasPreviousEmployment: z.boolean().optional(),
  emergencyContactName: z.string().min(2, 'Emergency contact name is required'),
  emergencyContactPhone: z.string().min(10, 'Emergency contact phone is required'),
  emergencyContactRelation: z.string().min(2, 'Relationship is required')
});