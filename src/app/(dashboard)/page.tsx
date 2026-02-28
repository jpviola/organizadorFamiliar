
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, CalendarDays, Utensils } from "lucide-react";
import { RecentTasksTable } from "@/components/dashboard/recent-tasks-table";
import { WeeklyActivityChart } from "@/components/dashboard/weekly-activity-chart";
import { db } from "@/db";
import { tasks, events, meals } from "@/db/schema";
import { desc, and, gte, lte, eq } from "drizzle-orm";
import { startOfDay, endOfDay, subDays, format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";

async function getDashboardData() {
  try {
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);

    // Fetch tasks
    const allTasks = await db.select().from(tasks).orderBy(desc(tasks.createdAt));
    
    // Fetch today's events
    const todayEvents = await db.select().from(events).where(
      and(
        gte(events.startTime, startOfToday),
        lte(events.startTime, endOfToday)
      )
    ).orderBy(events.startTime);

    // Fetch today's meals
    const todayMeals = await db.select().from(meals).where(
      and(
        gte(meals.date, startOfToday),
        lte(meals.date, endOfToday),
        eq(meals.type, "dinner")
      )
    );

    // Process tasks data
    const pendingTasks = allTasks.filter(t => t.status === 'todo' || t.status === 'in_progress').length;
    
    const recentTasks = allTasks.slice(0, 5).map(task => ({
      ...task,
      createdAt: task.createdAt.toISOString(),
      status: task.status as "todo" | "in_progress" | "done",
      priority: task.priority as "low" | "medium" | "high",
      assigneeId: task.assigneeId || undefined,
      description: task.description ?? undefined,
    }));

    // Process weekly activity (completed tasks per day)
    const weeklyActivity = Array.from({ length: 7 }).map((_, i) => {
      const date = subDays(today, 6 - i);
      const dayName = format(date, "EEE", { locale: es });
      const completedCount = allTasks.filter(t => 
        t.status === 'done' && 
        isSameDay(t.updatedAt, date) // Assuming updatedAt reflects completion time for done tasks
      ).length;

      return {
        name: dayName.charAt(0).toUpperCase() + dayName.slice(1),
        total: completedCount
      };
    });

    // Process today's summary
    const eventCount = todayEvents.length;
    const nextEvent = todayEvents.length > 0 ? todayEvents[0] : null;
    const dinner = todayMeals.length > 0 ? todayMeals[0] : null;

    return {
      pendingTasks,
      recentTasks,
      weeklyActivity,
      eventSummary: {
        count: eventCount,
        nextEvent: nextEvent ? {
          title: nextEvent.title,
          time: format(nextEvent.startTime, "HH:mm")
        } : null
      },
      dinnerSummary: dinner ? {
        description: dinner.description,
        assignedTo: dinner.assignedTo
      } : null
    };
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    return {
      pendingTasks: 0,
      recentTasks: [],
      weeklyActivity: [],
      eventSummary: { count: 0, nextEvent: null },
      dinnerSummary: null
    };
  }
}

export default async function DashboardPage() {
  const { 
    pendingTasks, 
    recentTasks, 
    weeklyActivity, 
    eventSummary, 
    dinnerSummary 
  } = await getDashboardData();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tareas Pendientes</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasks}</div>
            <p className="text-xs text-muted-foreground">Tareas por hacer o en progreso</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos de Hoy</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventSummary.count}</div>
            <p className="text-xs text-muted-foreground truncate">
              {eventSummary.nextEvent 
                ? `${eventSummary.nextEvent.time} - ${eventSummary.nextEvent.title}`
                : "Sin eventos programados"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cena de Hoy</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">
              {dinnerSummary?.description || "No planificada"}
            </div>
            <p className="text-xs text-muted-foreground">
              {dinnerSummary?.assignedTo 
                ? `Preparada por: ${dinnerSummary.assignedTo}` 
                : "Sin asignar"}
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Actividad Semanal</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <WeeklyActivityChart data={weeklyActivity} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Tareas Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentTasksTable tasks={recentTasks} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
