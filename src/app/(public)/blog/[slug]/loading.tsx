import { Skeleton } from "@/components/ui/skeleton";

export default function BlogPostLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-16 border-b" />

      <header className="py-12">
        <div className="container max-w-4xl space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-full" />
          <div className="flex items-center gap-6 pt-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </header>

      <article className="py-12">
        <div className="container max-w-4xl">
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
            <Skeleton className="h-8 w-64 mt-8" />
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
