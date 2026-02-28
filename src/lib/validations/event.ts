import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(1, "El título es obligatorio").max(100),
  description: z.string().optional(),
  startTime: z.date({
    message: "La fecha de inicio es obligatoria",
  }),
  endTime: z.date({
    message: "La fecha de fin es obligatoria",
  }),
  isAllDay: z.boolean().default(false),
  location: z.string().optional(),
  type: z.enum(["general", "school", "work", "vacation", "activity"]).default("general"),
}).refine((data) => data.endTime >= data.startTime, {
  message: "La fecha de fin debe ser posterior a la fecha de inicio",
  path: ["endTime"],
});

export type EventSchema = z.infer<typeof eventSchema>;
