import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-4 px-2">
          <div className="container mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between gap-3">
              <Skeleton className="h-8 w-[200px]" />
              <Skeleton className="h-8 w-32" />
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <div className="p-4 space-y-3">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
