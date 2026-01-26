import { Loader2 } from "lucide-react";

export default function ManageBookingLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="mt-4 text-muted-foreground">Loading booking...</p>
      </div>
    </div>
  );
}
