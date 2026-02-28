"use server";

import { db } from "@/db";
import { events } from "@/db/schema";
import { EventSchema } from "@/lib/validations/event";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function createEvent(data: EventSchema) {
  try {
    await db.insert(events).values({
      title: data.title,
      description: data.description,
      startTime: data.startTime,
      endTime: data.endTime,
      isAllDay: data.isAllDay,
      location: data.location,
      type: data.type,
    });

    revalidatePath("/dashboard/calendar");
    revalidatePath("/dashboard"); // Also update dashboard summary
    return { success: true };
  } catch (error) {
    console.error("Failed to create event:", error);
    return { success: false, error: "Failed to create event" };
  }
}

export async function updateEvent(id: string, data: EventSchema) {
  try {
    await db
      .update(events)
      .set({
        title: data.title,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
        isAllDay: data.isAllDay,
        location: data.location,
        type: data.type,
        updatedAt: new Date(),
      })
      .where(eq(events.id, id));
    
    revalidatePath("/dashboard/calendar");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to update event:", error);
    return { success: false, error: "Failed to update event" };
  }
}

export async function deleteEvent(id: string) {
  try {
    await db.delete(events).where(eq(events.id, id));
    
    revalidatePath("/dashboard/calendar");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete event:", error);
    return { success: false, error: "Failed to delete event" };
  }
}
