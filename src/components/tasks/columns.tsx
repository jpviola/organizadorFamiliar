
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { TaskSchema } from "@/lib/validations/task";

import { TaskActions } from "@/components/tasks/task-actions";

// Extend TaskSchema with ID for display
export type Task = TaskSchema & {
  id: string;
  createdAt: string;
};

export const columns: ColumnDef<Task>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Seleccionar todo"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Seleccionar fila"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Título
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "done" ? "secondary" : "outline"}>
          {status === "todo"
            ? "Por hacer"
            : status === "in_progress"
            ? "En progreso"
            : "Completada"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "priority",
    header: "Prioridad",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string;
      return (
        <div className="flex items-center">
          <span
            className={`mr-2 h-2 w-2 rounded-full ${
              priority === "high"
                ? "bg-red-500"
                : priority === "medium"
                ? "bg-yellow-500"
                : "bg-green-500"
            }`}
          />
          {priority === "high"
            ? "Alta"
            : priority === "medium"
            ? "Media"
            : "Baja"}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <TaskActions task={row.original} />,
  },
];
