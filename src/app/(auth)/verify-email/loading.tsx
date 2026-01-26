import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function VerifyEmailLoading() {
  return (
    <Card className="w-full max-w-md shadow-warm-lg animate-in fade-in-50 duration-300">
      <CardHeader className="space-y-2 text-center">
        <Skeleton className="h-8 w-44 mx-auto" />
        <Skeleton className="h-4 w-56 mx-auto" />
      </CardHeader>
      <CardContent className="flex flex-col items-center py-8 space-y-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </CardContent>
    </Card>
  );
}
