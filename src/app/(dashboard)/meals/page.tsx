import { Metadata } from "next";
import { db } from "@/db";
import { meals } from "@/db/schema";
import { desc } from "drizzle-orm";
import { WeeklyMealPlanner } from "@/components/meals/weekly-meal-planner";

export const metadata: Metadata = {
  title: "Comidas | Organizador Familiar",
  description: "Planificación de menús y comidas",
};

async function getMeals() {
  try {
    const data = await db.select().from(meals).orderBy(desc(meals.date));
    return data.map((meal) => ({
      id: meal.id,
      date: meal.date.toISOString(),
      type: meal.type,
      description: meal.description,
      assignedTo: meal.assignedTo || null,
    }));
  } catch (error) {
    console.error("Failed to fetch meals:", error);
    return [];
  }
}

export default async function MealsPage() {
  const mealsData = await getMeals();

  return (
    <div className="flex h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Comidas</h2>
          <p className="text-muted-foreground">
            Planifica el menú semanal y gestiona las recetas.
          </p>
        </div>
      </div>
      <div className="flex-1 overflow-x-auto pb-4">
        <WeeklyMealPlanner meals={mealsData} />
      </div>
    </div>
  );
}

