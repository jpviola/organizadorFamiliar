"use server";

import { db } from "@/db";
import { meals } from "@/db/schema";
import { MealSchema } from "@/lib/validations/meal";
import { revalidatePath } from "next/cache";
import { eq, and, gte, lte } from "drizzle-orm";
import { startOfWeek, endOfWeek } from "date-fns";

export async function createMeal(data: MealSchema) {
  try {
    await db.insert(meals).values({
      date: data.date,
      type: data.type,
      description: data.description,
      assignedTo: data.assignedTo || null,
    });

    revalidatePath("/dashboard/meals");
    revalidatePath("/dashboard"); // Also update dashboard summary
    return { success: true };
  } catch (error) {
    console.error("Failed to create meal:", error);
    return { success: false, error: "Failed to create meal" };
  }
}

export async function updateMeal(id: string, data: MealSchema) {
  try {
    await db
      .update(meals)
      .set({
        date: data.date,
        type: data.type,
        description: data.description,
        assignedTo: data.assignedTo || null,
      })
      .where(eq(meals.id, id));
    
    revalidatePath("/dashboard/meals");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to update meal:", error);
    return { success: false, error: "Failed to update meal" };
  }
}

export async function deleteMeal(id: string) {
  try {
    await db.delete(meals).where(eq(meals.id, id));
    
    revalidatePath("/dashboard/meals");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete meal:", error);
    return { success: false, error: "Failed to delete meal" };
  }
}

export async function getWeeklyMeals(date: Date) {
    try {
        const start = startOfWeek(date, { weekStartsOn: 1 });
        const end = endOfWeek(date, { weekStartsOn: 1 });

        const weeklyMeals = await db.select().from(meals).where(
            and(
                gte(meals.date, start),
                lte(meals.date, end)
            )
        );
        return weeklyMeals;
    } catch (error) {
        console.error("Failed to fetch weekly meals:", error);
        return [];
    }
}
