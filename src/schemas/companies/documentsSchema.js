import { z } from "zod";

export const createDocumentCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export const createDocumentTypeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.number().int().positive(1,"Category is required"),
  description: z.string().optional(),
  requires_acknowledgment: z.boolean(),
});




