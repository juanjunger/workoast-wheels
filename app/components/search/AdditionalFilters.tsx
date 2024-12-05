import { useForm, Controller } from "react-hook-form";
import { trpc } from "@/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// Define a type for the form data
interface FormData {
  minPrice: number;
  maxPrice: number;
  minPassengers: number;
  vehicleClass: string;
  vehicleMake: string;
}

interface AdditionalFiltersProps {
  onApplyFilters: (data: FormData) => void;
}

export function AdditionalFilters({ onApplyFilters }: AdditionalFiltersProps) {
  const { register, handleSubmit, reset, control } = useForm<FormData>({
    defaultValues: {
      minPrice: 0,
      maxPrice: 0,
      minPassengers: 0,
      vehicleClass: "",
      vehicleMake: "",
    },
  });
  const { data: options } = trpc.vehicles.options.useQuery();

  const onSubmit = (data: FormData) => {
    onApplyFilters(data);
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Filters</h3>

          <div className="space-y-2">
            <label className="text-sm font-medium">Hourly Price Range</label>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                placeholder="Min $"
                {...register("minPrice", { valueAsNumber: true })}
              />
              <Input
                type="number"
                placeholder="Max $"
                {...register("maxPrice", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Minimum Passengers</label>
            <Controller
              name="minPassengers"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value ? field.value.toString() : undefined}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a quantity">
                      {field.value
                        ? `${field.value}+ passengers`
                        : "Select a quantity"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {[2, 4, 5, 7, 8].map((count) => (
                      <SelectItem key={count} value={count.toString()}>
                        {count}+ passengers
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Vehicle Class</label>
            <Controller
              name="vehicleClass"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {options?.classifications.map((classification) => (
                      <SelectItem key={classification} value={classification}>
                        {classification}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Model</label>
            <Controller
              name="vehicleMake"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {options?.makes.map((make) => (
                      <SelectItem key={make} value={make}>
                        {make}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button type="submit" className="w-full">
            Apply Filters
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const defaultValues = {
                minPrice: 0,
                maxPrice: 0,
                minPassengers: 0,
                vehicleClass: "",
                vehicleMake: "",
              };
              reset(defaultValues);
              onApplyFilters(defaultValues);
            }}
            className="w-full"
          >
            Reset Filters
          </Button>
        </div>
      </form>
    </Card>
  );
}
