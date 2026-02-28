"use client";

import { useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventDialog } from "@/components/calendar/event-dialog";
import { cn } from "@/lib/utils";

interface SerializedEvent {
  id: string;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
  isAllDay: boolean | null;
  location: string | null;
  type: string | null;
}

interface CalendarViewProps {
  events: SerializedEvent[];
}

export function CalendarView({ events }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Convert serialized events to Date objects for internal use
  const parsedEvents = events.map(event => ({
    ...event,
    startTime: new Date(event.startTime),
    endTime: new Date(event.endTime),
    description: event.description || undefined,
    location: event.location || undefined,
    type: (event.type as "general" | "school" | "work" | "vacation" | "activity") || "general",
    isAllDay: event.isAllDay || false,
  }));

  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);
  const startDate = startOfWeek(firstDayOfMonth, { weekStartsOn: 1 }); // Monday start
  const endDate = endOfWeek(lastDayOfMonth, { weekStartsOn: 1 });

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  return (
    <div className="flex h-full flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold capitalize">
            {format(currentDate, "MMMM yyyy", { locale: es })}
          </h2>
          <div className="flex items-center rounded-md border bg-background shadow-sm">
            <Button variant="ghost" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={goToToday}>
              Hoy
            </Button>
            <Button variant="ghost" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <EventDialog />
      </div>

      <div className="grid grid-cols-7 gap-px rounded-t-lg bg-muted text-center text-sm font-semibold leading-6 shadow-sm border border-b-0">
        {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => (
          <div key={day} className="bg-background py-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid flex-1 grid-cols-7 auto-rows-fr gap-px bg-muted shadow-sm border rounded-b-lg overflow-hidden min-h-[600px]">
        {days.map((day, dayIdx) => {
          const dayEvents = parsedEvents.filter((event) =>
            isSameDay(event.startTime, day)
          );

          return (
            <div
              key={day.toString()}
              className={cn(
                "relative min-h-[100px] bg-background p-2 hover:bg-muted/50 transition-colors group flex flex-col gap-1",
                !isSameMonth(day, firstDayOfMonth) && "bg-muted/20 text-muted-foreground"
              )}
            >
              <time
                dateTime={format(day, "yyyy-MM-dd")}
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                  isSameDay(day, new Date()) && "bg-primary text-primary-foreground"
                )}
              >
                {format(day, "d")}
              </time>
              
              <div className="flex-1 space-y-1 overflow-y-auto max-h-[100px] scrollbar-hide">
                {dayEvents.map((event) => (
                  <EventDialog
                    key={event.id}
                    eventToEdit={event}
                    trigger={
                      <div 
                        className={cn(
                          "w-full cursor-pointer truncate rounded px-1 py-0.5 text-xs font-medium hover:opacity-80",
                          event.type === 'school' ? "bg-blue-100 text-blue-700" :
                          event.type === 'work' ? "bg-gray-100 text-gray-700" :
                          event.type === 'vacation' ? "bg-green-100 text-green-700" :
                          event.type === 'activity' ? "bg-orange-100 text-orange-700" :
                          "bg-primary/10 text-primary"
                        )}
                      >
                        {event.title}
                      </div>
                    }
                  />
                ))}
              </div>

              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                 <EventDialog
                    defaultDate={day}
                    trigger={
                      <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-muted">
                        <Plus className="h-3 w-3" />
                      </Button>
                    }
                 />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
