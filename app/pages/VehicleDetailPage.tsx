import { useParams, useNavigate } from "react-router-dom";
import { trpc } from "@/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export function VehicleDetailPage() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();

  if (!vehicleId) return <div>No vehicle id</div>;
  const { data: vehicle } = trpc.vehicles.get.useQuery({ id: vehicleId });

  if (!vehicle) return <div>Loading...</div>;

  return (
    <div className="container mx-auto flex flex-col">
      <div className="grid grid-cols-12 grid-flow-row gap-6">
        <div className="pt-8 pb-4 grid grid-cols-subgrid col-span-12 md:sticky top-0 bg-background/80 backdrop-blur-md z-10">
          <div className="px-4 flex items-center gap-4 col-span-12">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="p-2"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
              Vehicle Details
            </h1>
          </div>
        </div>

        <div className="col-span-12 px-4 pb-8">
          <Card className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/2">
                <img
                  src={vehicle.thumbnail_url}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
              <div className="flex-1 space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl md:text-3xl font-bold">
                    {vehicle.make} {vehicle.model}
                  </h2>
                  <p className="text-xl md:text-2xl font-semibold text-primary">
                    ${(vehicle.hourly_rate_cents / 100).toFixed(2)}/hr
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Year</span>
                    <p className="text-lg font-medium">{vehicle.year}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Class</span>
                    <p className="text-lg font-medium capitalize">
                      {vehicle.classification}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">
                      Passengers
                    </span>
                    <p className="text-lg font-medium">
                      {vehicle.max_passengers}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Doors</span>
                    <p className="text-lg font-medium">{vehicle.doors}</p>
                  </div>
                </div>

                <Button
                  size="lg"
                  onClick={() => navigate(`/review?vehicleId=${vehicle.id}`)}
                  className="w-full md:w-auto mt-4"
                >
                  Reserve Now
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
