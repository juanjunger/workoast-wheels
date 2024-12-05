import { Vehicle } from "@/trpc";

interface VehicleDetailsProps {
  vehicle: Vehicle;
}

export function VehicleDetails({ vehicle }: VehicleDetailsProps) {
  return (
    <div className="card">
      <img
        src={vehicle.thumbnail_url}
        alt={`${vehicle.make} ${vehicle.model}`}
      />
      <h3>{`${vehicle.make} ${vehicle.model}`}</h3>
      <p>{`$${vehicle.hourly_rate_cents / 100}/hr`}</p>
      <p>{`Seats: ${vehicle.max_passengers}`}</p>
      <button>Reserve now</button>
    </div>
  );
}
