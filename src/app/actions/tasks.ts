
"use server";

import { db } from "@/db";
import { tasks } from "@/db/schema";
import { TaskSchema } from "@/lib/validations/task";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function createTask(data: TaskSchema) {
  try {
    await db.insert(tasks).values({
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      assigneeId: data.assigneeId || null,
    });

    revalidatePath("/dashboard/tasks");
    return { success: true };
  } catch (error) {
    console.error("Failed to create task:", error);
    return { success: false, error: "Failed to create task" };
  }
}

export async function updateTask(id: string, data: TaskSchema) {
  try {
    await db
      .update(tasks)
      .set({
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        assigneeId: data.assigneeId || null,
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, id));
    
    revalidatePath("/dashboard/tasks");
    return { success: true };
  } catch (error) {
    console.error("Failed to update task:", error);
    return { success: false, error: "Failed to update task" };
  }
}

export async function deleteTask(id: string) {
  try {
    await db.delete(tasks).where(eq(tasks.id, id));
    
    revalidatePath("/dashboard/tasks");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete task:", error);
    return { success: false, error: "Failed to delete task" };
  }
}
