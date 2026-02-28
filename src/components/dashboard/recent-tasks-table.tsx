
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Task } from "@/components/tasks/columns";

interface RecentTasksTableProps {
  tasks: Task[];
}

export function RecentTasksTable({ tasks }: RecentTasksTableProps) {
  if (!tasks.length) {
    return <div className="text-center text-sm text-muted-foreground py-4">No hay tareas recientes</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Título</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Prioridad</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell className="font-medium">{task.title}</TableCell>
            <TableCell>
              <Badge variant={task.status === "done" ? "secondary" : "outline"}>
                {task.status === "todo"
                  ? "Por hacer"
                  : task.status === "in_progress"
                  ? "En progreso"
                  : "Completada"}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <span
                className={`inline-block h-2 w-2 rounded-full ${
                  task.priority === "high"
                    ? "bg-red-500"
                    : task.priority === "medium"
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
