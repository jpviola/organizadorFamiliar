
import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "El título es obligatorio").max(100),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["todo", "in_progress", "done"]),
  assigneeId: z.string().optional(),
});

export type TaskSchema = z.infer<typeof taskSchema>;
