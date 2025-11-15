import { z } from 'zod';

export const overtimeRequestSchema = z.object({
    date: z.string().min(1, 'Date is required'),
    total_hours: z.coerce.number().min(1, 'Hours must be at least 1').max(12, 'Hours cannot exceed 12'),
    reason: z.string().min(1, 'Reason is required').max(500, 'Reason cannot exceed 500 characters'),
});
export const offsiteRequestSchema = z.object({
    request_type: z.string().min(1, 'Request type is required'),
    date: z.string().min(1, 'Date is required'),
    start_time: z.string().min(1, 'Start time is required'),
    end_time: z.string().min(1, 'End time is required'),
    location: z.string().min(1, 'Location is required').max(255, 'Location cannot exceed 255 characters'),
    reason: z.string().min(1, 'Reason is required').max(500, 'Reason cannot exceed 500 characters'),
});


