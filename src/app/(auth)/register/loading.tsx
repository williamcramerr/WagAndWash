import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function RegisterLoading() {
  return (
    <Card className="w-full max-w-md shadow-warm-lg animate-in fade-in-50 duration-300">
      <CardHeader className="space-y-2 text-center">
        <Skeleton className="h-8 w-48 mx-auto" />
        <Skeleton className="h-4 w-64 mx-auto" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-4 w-40 mx-auto" />

        {/* Account type cards */}
        <div className="space-y-3">
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>

        <Skeleton className="h-11 w-full" />

        {/* Divider */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-px flex-1" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-px flex-1" />
        </div>

        {/* Social buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
