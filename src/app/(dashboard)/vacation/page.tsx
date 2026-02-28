import { Metadata } from "next";
import { getTrips } from "@/app/actions/trips";
import { TripCard } from "@/components/vacation/trip-card";
import { TripDialog } from "@/components/vacation/trip-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "Vacaciones | Organizador Familiar",
  description: "Planificación de viajes y vacaciones",
};

export default async function VacationPage() {
  const trips = await getTrips();

  return (
    <div className="flex h-full flex-1 flex-col space-y-8 p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Vacaciones</h2>
          <p className="text-muted-foreground">
            Organización de viajes y escapadas familiares.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <TripDialog />
        </div>
      </div>

      {trips.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed shadow-sm min-h-[400px]">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              No hay viajes planificados
            </h3>
            <p className="text-sm text-muted-foreground">
              Comienza a planificar tu próxima aventura familiar.
            </p>
            <div className="mt-4">
              <TripDialog
                trigger={
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Nuevo Viaje
                  </Button>
                }
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
}
