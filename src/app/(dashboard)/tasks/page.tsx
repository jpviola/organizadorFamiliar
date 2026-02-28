
import { Metadata } from "next";
import { DataTable } from "@/components/tasks/data-table";
import { columns } from "@/components/tasks/columns";
import { TaskDialog } from "@/components/tasks/task-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { desc } from "drizzle-orm";

export const metadata: Metadata = {
  title: "Tareas | Organizador Familiar",
  description: "Gestión de tareas y responsabilidades",
};

async function getTasks() {
  try {
    const data = await db.select().from(tasks).orderBy(desc(tasks.createdAt));
    return data.map((task) => ({
      ...task,
      createdAt: task.createdAt.toISOString(),
      status: task.status as "todo" | "in_progress" | "done",
      priority: task.priority as "low" | "medium" | "high",
      assigneeId: task.assigneeId || undefined,
      description: task.description ?? undefined,
    }));
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    return [];
  }
}

export default async function TasksPage() {
  const tasksData = await getTasks();

  return (
    <div className="flex h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tareas</h2>
          <p className="text-muted-foreground">
            Aquí tienes una lista de las tareas asignadas a la familia.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <TaskDialog
            trigger={
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Nueva Tarea
              </Button>
            }
          />
        </div>
      </div>
      <DataTable data={tasksData} columns={columns} />
    </div>
  );
}
