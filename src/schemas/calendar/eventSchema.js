import { z } from 'zod';

export const createEventSchema = z.object({
  title: z.string()
    .min(1, 'Event title is required')
    .max(200, 'Title must be less than 200 characters'),
  
  description: z.string()
    .max(300, 'Description must be less than 300 characters')
    .optional(),
  
  event_type: z.string().optional(),
  
  department: z.string().optional(),
  
  date: z.string()
    .min(1, 'Date is required')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  
  start_time: z.string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format'),
  
  end_time: z.string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format'),
  
  location: z.string()
    .max(200, 'Location must be less than 200 characters')
    .optional(),
  
  meeting_link: z.string()
    .refine((val) => {
      if (!val || val.trim() === '') return true;
      try {
        const url = new URL(val);
        return ['http:', 'https:'].includes(url.protocol);
      } catch {
        return false;
      }
    }, 'Please enter a valid URL')
    .optional()
    .or(z.literal('')),
}).refine((data) => {
  if (data.start_time && data.end_time) {
    const [startHour, startMin] = data.start_time.split(':').map(Number);
    const [endHour, endMin] = data.end_time.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    return endMinutes > startMinutes;
  }
  return true;
}, {
  message: 'End time must be after start time',
  path: ['end_time']
});



export const updateEventSchema = z.object({
  title: z.string()
    .min(1, 'Event title is required')
    .max(200, 'Title must be less than 200 characters'),
  
  description: z.string()
    .max(300, 'Description must be less than 300 characters')
    .optional(),
  
  event_type: z.string().optional(),
  
  department: z.string().optional(),
  
  date: z.string()
    .min(1, 'Date is required')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  
  start_time: z.string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format'),
  
  end_time: z.string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format'),
  
  location: z.string()
    .max(200, 'Location must be less than 200 characters')
    .optional(),
  
  meeting_link: z.string()
    .refine((val) => {
      if (!val || val.trim() === '') return true;
      try {
        const url = new URL(val);
        return ['http:', 'https:'].includes(url.protocol);
      } catch {
        return false;
      }
    }, 'Please enter a valid URL')
    .optional()
    .or(z.literal('')),
}).refine((data) => {
  if (data.start_time && data.end_time) {
    const [startHour, startMin] = data.start_time.split(':').map(Number);
    const [endHour, endMin] = data.end_time.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    return endMinutes > startMinutes;
  }
  return true;
}, {
  message: 'End time must be after start time',
  path: ['end_time']
});