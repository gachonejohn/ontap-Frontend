import { z } from "zod";



export const selectTimezoneSchema = z.object({
  timezone: z.string().min(2, "Timezone is required"),
});


