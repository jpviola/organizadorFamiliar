import { Metadata } from "next";
import { db } from "@/db";
import { events } from "@/db/schema";
import { desc } from "drizzle-orm";
import { CalendarView } from "@/components/calendar/calendar-view";

export const metadata: Metadata = {
  title: "Calendario | Organizador Familiar",
  description: "Eventos y planificación familiar",
};

async function getEvents() {
  try {
    const data = await db.select().from(events).orderBy(desc(events.startTime));
    return data.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      startTime: event.startTime.toISOString(),
      endTime: event.endTime.toISOString(),
      isAllDay: event.isAllDay,
      location: event.location,
      type: event.type,
    }));
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return [];
  }
}

export default async function CalendarPage() {
  const eventsData = await getEvents();

  return (
    <div className="flex h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Calendario</h2>
          <p className="text-muted-foreground">
            Planificación mensual y semanal de eventos.
          </p>
        </div>
      </div>
      <div className="flex-1 h-full">
        <CalendarView events={eventsData} />
      </div>
    </div>
  );
}

