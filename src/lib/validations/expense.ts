import { z } from "zod";

export const expenseSchema = z.object({
  amount: z.coerce.number().positive("El monto debe ser positivo"),
  category: z.string().min(1, "La categoría es requerida"),
  description: z.string().min(1, "La descripción es requerida"),
  date: z.date({
    message: "La fecha es requerida",
  }),
});

export type ExpenseSchema = z.infer<typeof expenseSchema>;
