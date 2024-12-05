import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { combineDateTime } from "./form";
import { Vehicle } from "@/trpc";

interface VehicleListProps {
  vehicles: Vehicle[];
  startDate: Date;
  startTime: string;
  endDate: Date;
  endTime: string;
}

export function VehicleList({
  vehicles,
  startDate,
  startTime,
  endDate,
  endTime,
}: VehicleListProps) {
  const navigate = useNavigate();

  const handleBooking = (vehicleId: string) => {
    const start = combineDateTime(startDate, startTime).toISOString();
    const end = combineDateTime(endDate, endTime).toISOString();
    navigate(`/review?vehicleId=${vehicleId}&start=${start}&end=${end}`);
  };

  return (
    <div className="grid gap-6">
      {vehicles?.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No vehicles found matching your criteria
        </div>
      ) : (
        vehicles?.map((vehicle) => (
          <Card
            key={vehicle.id}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col md:flex-row md:items-center gap-6 p-4 md:p-6">
              <div className="relative w-full md:w-48 h-48 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={vehicle.thumbnail_url}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>

              <div className="flex-1 min-w-0 space-y-4">
                <div>
                  <div className="flex gap-2 items-center">
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight">
                      {vehicle.make} {vehicle.model}
                    </h3>
                    <span className="text-sm text-muted-foreground">
                      ({vehicle.year})
                    </span>
                  </div>
                  <p className="text-base md:text-lg font-semibold text-primary mt-2">
                    ${(vehicle.hourly_rate_cents / 100).toFixed(2)}/hr
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">
                      Passengers
                    </div>
                    <div className="font-medium">
                      {vehicle.max_passengers} seats / {vehicle.doors} doors
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Class</div>
                    <div className="font-medium capitalize">
                      {vehicle.classification}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 md:flex-row">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate(`/vehicle/${vehicle.id}`)}
                  className="w-full md:w-auto"
                >
                  See details
                </Button>
                <Button
                  size="lg"
                  onClick={() => handleBooking(vehicle.id)}
                  className="w-full md:w-auto"
                >
                  Book now
                </Button>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
