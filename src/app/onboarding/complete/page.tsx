"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  CheckCircle,
  ArrowRight,
  Calendar,
  Users,
  Globe,
  Settings,
  Sparkles,
  PartyPopper,
} from "lucide-react";

const nextSteps = [
  {
    icon: Calendar,
    title: "Create your first appointment",
    description: "Add a client and book their pet for grooming",
    href: "/appointments/new",
  },
  {
    icon: Users,
    title: "Import existing clients",
    description: "Bring in contacts from your previous system",
    href: "/clients",
  },
  {
    icon: Globe,
    title: "Share your booking link",
    description: "Let clients book appointments online 24/7",
    href: "/settings",
  },
  {
    icon: Settings,
    title: "Customize your settings",
    description: "Fine-tune payment options, notifications, and more",
    href: "/settings",
  },
];

export default function OnboardingCompletePage() {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      {/* Confetti animation would go here */}
      {showConfetti && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 2, duration: 1 }}
          className="fixed inset-0 pointer-events-none flex items-center justify-center z-50"
        >
          <div className="flex gap-4 text-6xl animate-bounce">
            <PartyPopper className="h-16 w-16 text-primary" />
            <Sparkles className="h-16 w-16 text-amber-500" />
            <PartyPopper className="h-16 w-16 text-primary transform scale-x-[-1]" />
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto space-y-8"
      >
        {/* Success Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100"
          >
            <CheckCircle className="h-12 w-12 text-green-600" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold"
          >
            You&apos;re all set!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-muted-foreground"
          >
            Your grooming business is ready to go. Here&apos;s what you can do next.
          </motion.p>
        </div>

        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">6</p>
                  <p className="text-sm text-muted-foreground">Services added</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">6</p>
                  <p className="text-sm text-muted-foreground">Days open</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">0</p>
                  <p className="text-sm text-muted-foreground">Team invites</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">Ready</p>
                  <p className="text-sm text-muted-foreground">For bookings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold">Recommended next steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nextSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <Link href={step.href}>
                  <Card className="h-full hover:bg-accent/50 transition-colors cursor-pointer group">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                          <step.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium group-hover:text-primary transition-colors">
                            {step.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {step.description}
                          </p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="text-center pt-6"
        >
          <Button
            size="lg"
            className="gap-2 text-lg h-14 px-8"
            onClick={() => router.push("/")}
          >
            Go to Dashboard
            <ArrowRight className="h-5 w-5" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
