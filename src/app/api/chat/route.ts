import { openai } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { z } from "zod";
import { createTask } from "@/app/actions/tasks";
import { createEvent } from "@/app/actions/events";
import { createMeal } from "@/app/actions/meals";
import { createExpense } from "@/app/actions/expenses";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
    system: `Eres un asistente inteligente para una familia de 7 integrantes.
    Tu objetivo es ayudar a organizar la vida familiar, gestionar tareas, eventos, comidas y finanzas.
    Tienes acceso a herramientas para crear tareas, eventos, comidas y gastos.
    Si el usuario te pide crear algo, usa la herramienta adecuada.
    Sé proactivo y sugiere mejoras en la organización.
    Responde en español de manera concisa y amable.`,
    tools: {
      createTask: tool({
        description: "Crear una nueva tarea para un miembro de la familia",
        inputSchema: z.object({
          title: z.string().describe("Título de la tarea"),
          description: z.string().optional().describe("Descripción detallada"),
          priority: z
            .enum(["low", "medium", "high"])
            .optional()
            .describe("Prioridad de la tarea"),
          assigneeId: z
            .string()
            .optional()
            .describe("ID del miembro asignado"),
        }),
        execute: async ({
          title,
          description,
          priority,
          assigneeId,
        }: {
          title: string;
          description?: string;
          priority?: "low" | "medium" | "high";
          assigneeId?: string;
        }) => {
          const result = await createTask({
            title,
            description,
            priority: (priority || "medium") as "low" | "medium" | "high",
            assigneeId,
            status: "todo",
          });
          return result;
        },
      }),
      createEvent: tool({
        description: "Crear un nuevo evento en el calendario",
        inputSchema: z.object({
          title: z.string().describe("Título del evento"),
          startTime: z
            .string()
            .describe("Fecha y hora de inicio ISO 8601"),
          endTime: z
            .string()
            .describe("Fecha y hora de fin ISO 8601"),
          description: z.string().optional(),
          location: z.string().optional(),
          type: z.enum([
            "general",
            "school",
            "work",
            "vacation",
            "activity",
          ]),
        }),
        execute: async ({
          title,
          startTime,
          endTime,
          description,
          location,
          type,
        }: {
          title: string;
          startTime: string;
          endTime: string;
          description?: string;
          location?: string;
          type: "general" | "school" | "work" | "vacation" | "activity";
        }) => {
          const result = await createEvent({
            title,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            description,
            location,
            type,
            isAllDay: false,
          });
          return result;
        },
      }),
      createMeal: tool({
        description: "Planificar una comida en el menú semanal",
        inputSchema: z.object({
          date: z.string().describe("Fecha de la comida ISO 8601"),
          type: z
            .enum(["breakfast", "lunch", "dinner", "snack"])
            .describe("Tipo de comida"),
          description: z
            .string()
            .describe("Descripción del menú o receta"),
          assignedTo: z
            .string()
            .optional()
            .describe("ID del responsable (opcional)"),
        }),
        execute: async ({
          date,
          type,
          description,
          assignedTo,
        }: {
          date: string;
          type: "breakfast" | "lunch" | "dinner" | "snack";
          description: string;
          assignedTo?: string;
        }) => {
          const result = await createMeal({
            date: new Date(date),
            type,
            description,
            assignedTo,
          });
          return result;
        },
      }),
      createExpense: tool({
        description: "Registrar un nuevo gasto",
        inputSchema: z.object({
          amount: z.number().describe("Monto del gasto"),
          category: z
            .string()
            .describe(
              "Categoría del gasto (groceries, utilities, education, transport, entertainment, health, clothing, other)",
            ),
          description: z.string().describe("Descripción del gasto"),
          date: z.string().describe("Fecha del gasto ISO 8601"),
        }),
        execute: async ({
          amount,
          category,
          description,
          date,
        }: {
          amount: number;
          category: string;
          description: string;
          date: string;
        }) => {
          const result = await createExpense({
            amount,
            category,
            description,
            date: new Date(date),
          });
          return result;
        },
      }),
    },
  });

  return result.toTextStreamResponse();
}
