import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book an Appointment | Wag & Wash",
  description: "Book your pet grooming appointment online",
};

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-xl">🐕</span>
              </div>
              <div>
                <h1 className="font-bold text-lg">Wag & Wash</h1>
                <p className="text-xs text-muted-foreground">Pet Grooming</p>
              </div>
            </div>
            <div className="text-right text-sm">
              <p className="font-medium">(555) 123-4567</p>
              <p className="text-muted-foreground">Mon-Sat 8am-6pm</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Wag & Wash</h3>
              <p className="text-sm text-muted-foreground">
                Professional pet grooming services for dogs and cats.
                Salon and mobile options available.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Contact</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>123 Pet Lane, Springfield, CA 90210</p>
                <p>(555) 123-4567</p>
                <p>hello@wagandwash.com</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Hours</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Monday - Friday: 8am - 6pm</p>
                <p>Saturday: 9am - 5pm</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Wag & Wash. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
