import { Skeleton } from "@/components/ui/skeleton";

export default function AboutLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-16 border-b" />
      <div className="container py-24">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <Skeleton className="h-12 w-3/4 mx-auto" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-2/3 mx-auto" />
        </div>
      </div>
    </div>
  );
}
