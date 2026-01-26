import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function CalendarLoading() {
  return (
    <div className="space-y-4 animate-in fade-in-50 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      {/* Calendar Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
          </div>
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-44" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Calendar Grid */}
      <Card className="overflow-hidden">
        {/* Header Row */}
        <div className="flex border-b bg-muted/30">
          <div className="w-16 shrink-0 border-r" />
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex-1 py-3 text-center border-r last:border-r-0">
              <Skeleton className="h-3 w-8 mx-auto mb-2" />
              <Skeleton className="h-8 w-8 rounded-full mx-auto" />
            </div>
          ))}
        </div>

        {/* Time Grid */}
        <div className="flex h-[500px]">
          {/* Time Labels */}
          <div className="w-16 shrink-0 border-r">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-[60px] pr-2 flex items-start justify-end pt-1">
                <Skeleton className="h-3 w-8" />
              </div>
            ))}
          </div>

          {/* Day Columns */}
          {Array.from({ length: 7 }).map((_, dayIndex) => (
            <div key={dayIndex} className="flex-1 relative border-r last:border-r-0">
              {Array.from({ length: 10 }).map((_, hourIndex) => (
                <div
                  key={hourIndex}
                  className="h-[60px] border-b border-dashed border-border/50"
                />
              ))}
              {/* Mock Appointments */}
              {dayIndex % 2 === 0 && (
                <div
                  className="absolute left-1 right-1 rounded-md bg-primary/10 border border-primary/20"
                  style={{
                    top: `${60 + dayIndex * 30}px`,
                    height: "80px",
                  }}
                >
                  <div className="p-2 space-y-1">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-2 w-16" />
                  </div>
                </div>
              )}
              {dayIndex % 3 === 1 && (
                <div
                  className="absolute left-1 right-1 rounded-md bg-secondary/10 border border-secondary/20"
                  style={{
                    top: `${180 + dayIndex * 20}px`,
                    height: "60px",
                  }}
                >
                  <div className="p-2 space-y-1">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-2 w-12" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
