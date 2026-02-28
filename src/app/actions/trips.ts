"use server";

import { db } from "@/db";
import { trips } from "@/db/schema";
import { TripSchema } from "@/lib/validations/trip";
import { revalidatePath } from "next/cache";
import { eq, desc } from "drizzle-orm";

export async function createTrip(data: TripSchema) {
  try {
    await db.insert(trips).values({
      destination: data.destination,
      startDate: data.startDate,
      endDate: data.endDate,
      description: data.description,
      budget: data.budget?.toString(),
      status: data.status,
    });

    revalidatePath("/dashboard/vacation");
    return { success: true };
  } catch (error) {
    console.error("Failed to create trip:", error);
    return { success: false, error: "Failed to create trip" };
  }
}

export async function updateTrip(id: string, data: TripSchema) {
  try {
    await db
      .update(trips)
      .set({
        destination: data.destination,
        startDate: data.startDate,
        endDate: data.endDate,
        description: data.description,
        budget: data.budget?.toString(),
        status: data.status,
      })
      .where(eq(trips.id, id));
    
    revalidatePath("/dashboard/vacation");
    return { success: true };
  } catch (error) {
    console.error("Failed to update trip:", error);
    return { success: false, error: "Failed to update trip" };
  }
}

export async function deleteTrip(id: string) {
  try {
    await db.delete(trips).where(eq(trips.id, id));
    
    revalidatePath("/dashboard/vacation");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete trip:", error);
    return { success: false, error: "Failed to delete trip" };
  }
}

export async function getTrips() {
  try {
    const data = await db.select().from(trips).orderBy(desc(trips.startDate));
    return data.map(t => ({
      ...t,
      budget: t.budget ? parseFloat(t.budget) : 0,
    }));
  } catch (error) {
    console.error("Failed to fetch trips:", error);
    return [];
  }
}
