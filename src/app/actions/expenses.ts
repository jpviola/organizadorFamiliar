"use server";

import { db } from "@/db";
import { expenses } from "@/db/schema";
import { ExpenseSchema } from "@/lib/validations/expense";
import { revalidatePath } from "next/cache";
import { eq, desc } from "drizzle-orm";

export async function createExpense(data: ExpenseSchema) {
  try {
    await db.insert(expenses).values({
      amount: data.amount.toString(),
      category: data.category,
      description: data.description,
      date: data.date,
    });

    revalidatePath("/dashboard/finances");
    return { success: true };
  } catch (error) {
    console.error("Failed to create expense:", error);
    return { success: false, error: "Failed to create expense" };
  }
}

export async function updateExpense(id: string, data: ExpenseSchema) {
  try {
    await db
      .update(expenses)
      .set({
        amount: data.amount.toString(),
        category: data.category,
        description: data.description,
        date: data.date,
      })
      .where(eq(expenses.id, id));
    
    revalidatePath("/dashboard/finances");
    return { success: true };
  } catch (error) {
    console.error("Failed to update expense:", error);
    return { success: false, error: "Failed to update expense" };
  }
}

export async function deleteExpense(id: string) {
  try {
    await db.delete(expenses).where(eq(expenses.id, id));
    
    revalidatePath("/dashboard/finances");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete expense:", error);
    return { success: false, error: "Failed to delete expense" };
  }
}

export async function getExpenses() {
  try {
    const data = await db.select().from(expenses).orderBy(desc(expenses.date));
    return data.map((expense) => ({
      ...expense,
      amount: parseFloat(expense.amount),
    }));
  } catch (error) {
    console.error("Failed to fetch expenses:", error);
    return [];
  }
}
