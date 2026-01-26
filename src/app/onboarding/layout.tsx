"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Dog, CheckCircle } from "lucide-react";

const steps = [
  { id: "welcome", path: "/onboarding", label: "Welcome" },
  { id: "business", path: "/onboarding/business", label: "Business" },
  { id: "services", path: "/onboarding/services", label: "Services" },
  { id: "hours", path: "/onboarding/hours", label: "Hours" },
  { id: "team", path: "/onboarding/invite-team", label: "Team" },
  { id: "complete", path: "/onboarding/complete", label: "Complete" },
];

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const currentStepIndex = steps.findIndex((step) => step.path === pathname);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;
  const isComplete = pathname === "/onboarding/complete";

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="container max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
              <Dog className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Wag & Wash</span>
          </div>

          {!isComplete && currentStepIndex > 0 && (
            <Button
              variant="ghost"
              onClick={() => router.push("/login")}
              className="text-muted-foreground"
            >
              Save & Exit
            </Button>
          )}
        </div>
      </header>

      {/* Progress Bar */}
      {!isComplete && (
        <div className="container max-w-5xl mx-auto px-4 py-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">
                Step {currentStepIndex + 1} of {steps.length}
              </span>
              <span className="text-muted-foreground">
                {steps[currentStepIndex]?.label}
              </span>
            </div>
            <Progress value={progress} className="h-2" />

            {/* Step indicators */}
            <div className="hidden md:flex justify-between">
              {steps.map((step, index) => {
                const isCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                  <div
                    key={step.id}
                    className={cn(
                      "flex items-center gap-2",
                      isCompleted && "text-primary",
                      isCurrent && "text-foreground",
                      !isCompleted && !isCurrent && "text-muted-foreground"
                    )}
                  >
                    <div
                      className={cn(
                        "h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium border-2 transition-all",
                        isCompleted && "bg-primary border-primary text-primary-foreground",
                        isCurrent && "border-primary text-primary",
                        !isCompleted && !isCurrent && "border-muted"
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span className="text-sm">{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="container max-w-5xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
