import { z } from "zod";

export const mealSchema = z.object({
  date: z.date({
    message: "La fecha es obligatoria",
  }),
  type: z.enum(["breakfast", "lunch", "dinner", "snack"]).refine((val) => val, {
    message: "El tipo de comida es obligatorio",
  }),
  description: z.string().min(1, "La descripción es obligatoria").max(255),
  assignedTo: z.string().optional(), // Clerk ID or custom ID
});

export type MealSchema = z.infer<typeof mealSchema>;
