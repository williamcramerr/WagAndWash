import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function PricingLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Skeleton className="h-8 w-40" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container text-center space-y-4">
          <Skeleton className="h-12 w-96 mx-auto" />
          <Skeleton className="h-6 w-80 mx-auto" />
          <div className="flex justify-center gap-4">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-32" />
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 -mt-8">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="text-center pb-2">
                  <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-7 w-24 mx-auto" />
                  <Skeleton className="h-4 w-48 mx-auto" />
                </CardHeader>
                <CardContent className="text-center">
                  <Skeleton className="h-14 w-32 mx-auto mb-8" />
                  <Skeleton className="h-12 w-full mb-8" />
                  <div className="space-y-3 text-left">
                    {Array.from({ length: 8 }).map((_, j) => (
                      <div key={j} className="flex items-center gap-3">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 flex-1" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <Skeleton className="h-8 w-64 mx-auto mb-12" />
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
