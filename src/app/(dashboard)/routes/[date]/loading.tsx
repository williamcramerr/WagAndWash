import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function RouteDayLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between mb-4">
            <div>
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-8 w-24" />
            </div>
            <div className="text-right">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
          <Skeleton className="h-2 w-full" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-24" />
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-28" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Skeleton className="h-6 w-24" />

      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="py-4">
            <div className="flex gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
