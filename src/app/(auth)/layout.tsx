import { Dog } from "lucide-react";
import Link from "next/link";
import { AuthIllustration, AuthTestimonial } from "@/components/auth/auth-illustration";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - Branding */}
      <div className="hidden lg:flex flex-col bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 p-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-primary">
          <div className="p-2 bg-primary rounded-xl">
            <Dog className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">Wag & Wash</span>
        </Link>

        {/* Illustration */}
        <div className="flex-1 flex items-center justify-center">
          <AuthIllustration />
        </div>

        {/* Testimonial */}
        <div className="max-w-md mx-auto">
          <AuthTestimonial />
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex flex-col">
        {/* Mobile logo */}
        <div className="lg:hidden p-6">
          <Link href="/" className="flex items-center gap-2 text-primary">
            <div className="p-2 bg-primary rounded-xl">
              <Dog className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">Wag & Wash</span>
          </Link>
        </div>

        {/* Form container */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-8">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Wag & Wash. All rights reserved.
          </p>
          <div className="flex justify-center gap-4 mt-2">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/help" className="hover:text-foreground transition-colors">
              Help
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
