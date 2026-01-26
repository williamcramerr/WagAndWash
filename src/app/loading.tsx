import { Dog } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Dog className="h-12 w-12 text-primary mx-auto animate-pulse" />
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
