import { z } from "zod";

export const tripSchema = z.object({
  destination: z.string().min(1, "El destino es obligatorio").max(100),
  startDate: z.date({
    message: "La fecha de inicio es obligatoria",
  }),
  endDate: z.date({
    message: "La fecha de fin es obligatoria",
  }),
  description: z.string().optional(),
  budget: z.coerce.number().min(0, "El presupuesto debe ser positivo").optional(),
  status: z.enum(["planned", "ongoing", "completed", "cancelled"]).default("planned"),
}).refine((data) => data.endDate >= data.startDate, {
  message: "La fecha de fin debe ser posterior a la fecha de inicio",
  path: ["endDate"],
});

export type TripSchema = z.infer<typeof tripSchema>;
