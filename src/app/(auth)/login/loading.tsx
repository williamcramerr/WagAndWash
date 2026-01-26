import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function LoginLoading() {
  return (
    <Card className="w-full max-w-md shadow-warm-lg animate-in fade-in-50 duration-300">
      <CardHeader className="space-y-2 text-center">
        <Skeleton className="h-8 w-40 mx-auto" />
        <Skeleton className="h-4 w-56 mx-auto" />
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Social buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-px flex-1" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-px flex-1" />
        </div>

        {/* Form fields */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-11 w-full" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-28" />
          </div>
          <Skeleton className="h-11 w-full" />
        </div>

        {/* Checkbox */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-36" />
        </div>

        {/* Submit button */}
        <Skeleton className="h-11 w-full" />

        {/* Toggle link */}
        <Skeleton className="h-4 w-48 mx-auto" />
      </CardContent>
    </Card>
  );
}
