"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { TripDialog } from "./trip-dialog";
import { Button } from "@/components/ui/button";

interface Trip {
  id: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  description: string | null;
  budget: number | null;
  status: string | null;
}

interface TripCardProps {
  trip: Trip;
}

export function TripCard({ trip }: TripCardProps) {
  const statusColors = {
    planned: "bg-blue-500",
    ongoing: "bg-green-500",
    completed: "bg-gray-500",
    cancelled: "bg-red-500",
  };

  const statusLabels = {
    planned: "Planificado",
    ongoing: "En curso",
    completed: "Completado",
    cancelled: "Cancelado",
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{trip.destination}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <CalendarDays className="mr-1 h-3 w-3" />
              {format(trip.startDate, "d MMM", { locale: es })} -{" "}
              {format(trip.endDate, "d MMM yyyy", { locale: es })}
            </CardDescription>
          </div>
          <Badge
            className={`${
              statusColors[trip.status as keyof typeof statusColors] || "bg-gray-500"
            } hover:${
              statusColors[trip.status as keyof typeof statusColors] || "bg-gray-500"
            }`}
          >
            {statusLabels[trip.status as keyof typeof statusLabels] || trip.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-2 text-sm">
          {trip.description && (
            <p className="text-muted-foreground line-clamp-3">{trip.description}</p>
          )}
          <div className="flex items-center text-muted-foreground mt-4">
            <DollarSign className="mr-1 h-4 w-4" />
            <span className="font-medium">
              Presupuesto: ${trip.budget?.toFixed(2) || "0.00"}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <TripDialog
          tripToEdit={{
            ...trip,
            description: trip.description || "",
            budget: trip.budget || 0,
            status:
              trip.status === "planned" ||
              trip.status === "ongoing" ||
              trip.status === "completed" ||
              trip.status === "cancelled"
                ? trip.status
                : "planned",
          }}
          trigger={<Button variant="outline" className="w-full">Editar</Button>}
        />
      </CardFooter>
    </Card>
  );
}
