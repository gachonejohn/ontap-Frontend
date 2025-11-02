import { z } from 'zod';

export const CreateEmployeeDocumentSchema = z.object({
  document_type: z.number().int().positive(1, 'Document Type is required'),
  description: z.string().nullable().optional(),
  expiry_date: z.string().optional(),
  file: z.instanceof(File, { message: 'File must be a valid upload' }).optional(),
});
