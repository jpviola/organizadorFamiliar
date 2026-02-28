"use client";

import { useState, Fragment } from "react";
import {
  addWeeks,
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameDay,
  startOfWeek,
  subWeeks,
} from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MealDialog } from "@/components/meals/meal-dialog";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface SerializedMeal {
  id: string;
  date: string;
  type: string;
  description: string;
  assignedTo: string | null;
}

interface WeeklyMealPlannerProps {
  meals: SerializedMeal[];
}

const MEAL_TYPES = [
  { value: "breakfast", label: "Desayuno" },
  { value: "lunch", label: "Almuerzo" },
  { value: "dinner", label: "Cena" },
  { value: "snack", label: "Merienda" },
];

export function WeeklyMealPlanner({ meals }: WeeklyMealPlannerProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const endDate = endOfWeek(currentDate, { weekStartsOn: 1 });

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const nextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
  const prevWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  // Parse meals dates
  const parsedMeals = meals.map(meal => ({
    ...meal,
    date: new Date(meal.date),
    type: meal.type as "breakfast" | "lunch" | "dinner" | "snack",
    assignedTo: meal.assignedTo || undefined,
  }));

  return (
    <div className="flex h-full flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold capitalize">
            {format(startDate, "MMMM yyyy", { locale: es })}
          </h2>
          <div className="flex items-center rounded-md border bg-background shadow-sm">
            <Button variant="ghost" size="icon" onClick={prevWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={goToToday}>
              Hoy
            </Button>
            <Button variant="ghost" size="icon" onClick={nextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <MealDialog />
      </div>

      <div className="grid grid-cols-8 gap-4 min-w-[800px]">
        {/* Header Row */}
        <div className="col-span-1 py-2 font-semibold text-muted-foreground"></div>
        {days.map((day) => (
          <div key={day.toString()} className="col-span-1 py-2 text-center">
            <div className="font-semibold capitalize">{format(day, "EEEE", { locale: es })}</div>
            <div className={cn(
              "mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm",
              isSameDay(day, new Date()) ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            )}>
              {format(day, "d")}
            </div>
          </div>
        ))}

        {/* Meal Rows */}
        {MEAL_TYPES.map((type) => (
          <Fragment key={type.value}>
            <div className="col-span-1 flex items-center font-medium text-sm text-muted-foreground">
              {type.label}
            </div>
            {days.map((day) => {
              const meal = parsedMeals.find(
                (m) => isSameDay(m.date, day) && m.type === type.value
              );

              return (
                <div key={`${day}-${type.value}`} className="col-span-1 min-h-[100px]">
                  {meal ? (
                    <MealDialog
                      mealToEdit={meal}
                      trigger={
                        <Card className="h-full cursor-pointer hover:border-primary transition-colors bg-muted/30 hover:bg-muted/50">
                          <CardContent className="p-3 text-sm h-full flex flex-col justify-between">
                            <p className="line-clamp-3 font-medium">{meal.description}</p>
                            {meal.assignedTo && (
                              <p className="text-xs text-muted-foreground mt-2 italic">
                                🍳 {meal.assignedTo === "parent-1" ? "Papá" : 
                                    meal.assignedTo === "parent-2" ? "Mamá" : 
                                    meal.assignedTo}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      }
                    />
                  ) : (
                    <div className="h-full group relative rounded-md border border-dashed hover:border-primary/50 flex items-center justify-center bg-background/50 hover:bg-muted/50 transition-colors">
                      <MealDialog
                        defaultDate={day}
                        defaultType={type.value as
                          | "breakfast"
                          | "lunch"
                          | "dinner"
                          | "snack"}
                        trigger={
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="opacity-0 group-hover:opacity-100 h-8 w-8 rounded-full"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        }
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
