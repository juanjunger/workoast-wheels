import { ErrorFallback } from "@/components/ErrorFallback";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { roundToNearest30Minutes } from "@/lib/times";
import { addDays, addHours, format } from "date-fns";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { FormValues } from "@/components/search/form";
import { AdditionalFilters } from "@/components/search/AdditionalFilters";
import { VehicleList } from "@/components/search/VehicleList";
import { TimeRangeFilters } from "@/components/search/TimeRangeFilters";
import { trpc } from "@/trpc";
interface FilterData {
  minPrice: number;
  maxPrice: number;
  minPassengers: number;
  vehicleClass: string;
  vehicleMake: string;
}

interface Filters {
  priceMin: number;
  priceMax: number;
  passengerCount: number;
  make: string[];
  classification: string[];
}

export function SearchPage() {
  const [initialStartDateAndTime] = useState(() =>
    roundToNearest30Minutes(addHours(new Date(), 1)),
  );

  const [initialEndDateAndTime] = useState(() =>
    addDays(initialStartDateAndTime, 1),
  );

  const [filters, setFilters] = useState<Filters>({
    priceMin: 0,
    priceMax: 100000,
    passengerCount: 0,
    make: [],
    classification: [],
  });

  const form = useForm<FormValues>({
    defaultValues: {
      startDate: initialStartDateAndTime,
      startTime: format(initialStartDateAndTime, "HH:mm"),
      endDate: initialEndDateAndTime,
      endTime: format(initialEndDateAndTime, "HH:mm"),
      minPassengers: 1,
      classification: [],
      make: [],
      price: [10, 100],
      page: 1,
    },
  });

  const handleApplyFilters = (data: FilterData) => {
    setFilters({
      priceMin: data.minPrice || 0,
      priceMax: data.maxPrice || 100000,
      passengerCount: data.minPassengers || 0,
      make: data.vehicleMake ? [data.vehicleMake] : [],
      classification: data.vehicleClass ? [data.vehicleClass] : [],
    });
  };

  const { data: vehicles } = trpc.vehicles.search.useQuery({
    startTime: format(initialStartDateAndTime, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    endTime: format(initialEndDateAndTime, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    priceMin: filters.priceMin,
    priceMax: filters.priceMax,
    passengerCount: filters.passengerCount,
    make: filters.make,
    classification: filters.classification,
  });

  return (
    <Form {...form}>
      <div className="container mx-auto flex flex-col">
        <div className="grid grid-cols-12 grid-flow-row">
          <div className="pt-12 pb-4 border-b grid grid-cols-subgrid col-span-12 md:sticky top-0 bg-background/80 backdrop-blur-md z-10">
            <div className="px-4 flex items-end col-span-12 md:col-span-3">
              <h1 className="text-2xl font-semibold tracking-tight">
                Workoast Wheels
              </h1>
            </div>
            <div className="px-4 col-span-12 md:col-span-9 mt-4 md:mt-0">
              <TimeRangeFilters />
            </div>
          </div>

          <div className="col-span-12 md:col-span-3 px-4 md:py-8">
            <div className="md:hidden mt-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">Filters</Button>
                </SheetTrigger>
                <SheetContent>
                  <ErrorBoundary
                    fallback={
                      <ErrorFallback message="Failed to load filters" />
                    }
                  >
                    <Suspense fallback={<div>Loading...</div>}>
                      <AdditionalFilters onApplyFilters={handleApplyFilters} />
                    </Suspense>
                  </ErrorBoundary>
                </SheetContent>
              </Sheet>
            </div>
            <div className="hidden md:block">
              <ErrorBoundary
                fallback={<ErrorFallback message="Failed to load filters" />}
              >
                <Suspense fallback={<div>Loading...</div>}>
                  <AdditionalFilters onApplyFilters={handleApplyFilters} />
                </Suspense>
              </ErrorBoundary>
            </div>
          </div>

          <div className="col-span-12 md:col-span-9 px-4 py-8">
            <ErrorBoundary
              fallback={<ErrorFallback message="Failed to load vehicles" />}
            >
              <Suspense fallback={<div>Loading...</div>}>
                {vehicles ? (
                  <VehicleList
                    vehicles={vehicles.vehicles}
                    startDate={form.watch("startDate")}
                    startTime={form.watch("startTime")}
                    endDate={form.watch("endDate")}
                    endTime={form.watch("endTime")}
                  />
                ) : (
                  <div>No vehicles found</div>
                )}
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </Form>
  );
}
