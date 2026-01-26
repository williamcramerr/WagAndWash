"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Dog, Cat, Sparkles, Heart, Star } from "lucide-react";

interface AuthIllustrationProps {
  variant?: "login" | "register" | "reset" | "verify" | "invite";
  className?: string;
}

export function AuthIllustration({
  variant = "login",
  className,
}: AuthIllustrationProps) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 text-primary/20 animate-pulse">
          <Sparkles className="h-8 w-8" />
        </div>
        <div className="absolute top-20 right-20 text-accent/20 animate-pulse animation-delay-300">
          <Star className="h-6 w-6" />
        </div>
        <div className="absolute bottom-20 left-20 text-secondary/30 animate-pulse animation-delay-500">
          <Heart className="h-7 w-7" />
        </div>
        <div className="absolute bottom-10 right-10 text-primary/20 animate-pulse animation-delay-200">
          <Sparkles className="h-5 w-5" />
        </div>
      </div>

      {/* Main illustration */}
      <div className="relative">
        {/* Circular background */}
        <div className="w-64 h-64 rounded-full bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 flex items-center justify-center">
          <div className="w-48 h-48 rounded-full bg-gradient-to-br from-primary/20 via-accent/15 to-secondary/15 flex items-center justify-center">
            {/* Pet icons */}
            <div className="relative">
              <div className="flex items-end gap-2">
                <div className="p-4 bg-card rounded-2xl shadow-warm-lg transform -rotate-6 animate-in slide-in-from-left duration-500">
                  <Dog className="h-16 w-16 text-primary" strokeWidth={1.5} />
                </div>
                <div className="p-4 bg-card rounded-2xl shadow-warm-lg transform rotate-6 animate-in slide-in-from-right duration-500 animation-delay-200">
                  <Cat className="h-14 w-14 text-secondary-foreground" strokeWidth={1.5} />
                </div>
              </div>
              {/* Sparkle accent */}
              <div className="absolute -top-2 -right-2 p-2 bg-accent rounded-full shadow-warm animate-bounce">
                <Sparkles className="h-4 w-4 text-accent-foreground" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AuthTestimonial() {
  const testimonials = [
    {
      quote: "Wag & Wash transformed how we manage our grooming business. Bookings are up 40%!",
      author: "Sarah M.",
      role: "Owner, Pampered Paws",
    },
    {
      quote: "The scheduling and client management is a game-changer. My clients love the reminders.",
      author: "Mike T.",
      role: "Mobile Groomer",
    },
    {
      quote: "Finally, software made for groomers by people who understand grooming.",
      author: "Lisa K.",
      role: "Grooming Salon Manager",
    },
  ];

  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const testimonial = testimonials[current];

  return (
    <div className="text-center space-y-4 animate-in fade-in duration-500" key={current}>
      <blockquote className="text-lg font-medium text-foreground/90 italic">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <div>
        <p className="font-semibold text-foreground">{testimonial.author}</p>
        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
      </div>
      {/* Dots indicator */}
      <div className="flex justify-center gap-2 pt-2">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              i === current ? "bg-primary w-4" : "bg-muted-foreground/30"
            )}
          />
        ))}
      </div>
    </div>
  );
}
