import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ForgotPasswordLoading() {
  return (
    <Card className="w-full max-w-md shadow-warm-lg animate-in fade-in-50 duration-300">
      <CardHeader className="space-y-2 text-center">
        <Skeleton className="h-8 w-44 mx-auto" />
        <Skeleton className="h-4 w-64 mx-auto" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-11 w-full" />
        </div>
        <Skeleton className="h-11 w-full" />
      </CardContent>
    </Card>
  );
}
