"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Dog,
  Calendar,
  Users,
  CreditCard,
  MapPin,
  BarChart3,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Drag-and-drop calendar with multi-groomer support",
  },
  {
    icon: Users,
    title: "Client Management",
    description: "Track pets, preferences, and grooming history",
  },
  {
    icon: CreditCard,
    title: "Easy Payments",
    description: "Accept cards, send invoices, manage deposits",
  },
  {
    icon: MapPin,
    title: "Mobile Routes",
    description: "Plan efficient routes for mobile grooming",
  },
  {
    icon: BarChart3,
    title: "Business Insights",
    description: "Revenue reports, trends, and analytics",
  },
  {
    icon: Sparkles,
    title: "Online Booking",
    description: "Let clients book 24/7 through your website",
  },
];

export default function OnboardingWelcomePage() {
  const router = useRouter();

  return (
    <div className="space-y-12">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
          <Sparkles className="h-4 w-4" />
          Welcome to Wag & Wash
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Let&apos;s set up your
          <br />
          <span className="text-primary">grooming business</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We&apos;ll help you get everything configured in just a few minutes.
          You can always adjust these settings later.
        </p>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {features.map((feature) => (
          <Card key={feature.title} className="bg-card/50 hover:bg-card transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-col items-center gap-4"
      >
        <Button
          size="lg"
          className="gap-2 text-lg h-14 px-8"
          onClick={() => router.push("/onboarding/business")}
        >
          Get Started
          <ArrowRight className="h-5 w-5" />
        </Button>
        <p className="text-sm text-muted-foreground">
          Takes about 5 minutes to complete
        </p>
      </motion.div>

      {/* Trust indicators */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="text-center pt-8 border-t"
      >
        <p className="text-sm text-muted-foreground mb-4">
          Trusted by grooming businesses everywhere
        </p>
        <div className="flex flex-wrap justify-center gap-8 text-muted-foreground/50">
          <div className="flex items-center gap-2">
            <Dog className="h-8 w-8" />
            <span className="text-2xl font-bold">5,000+</span>
            <span className="text-sm">pets groomed</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-8 w-8" />
            <span className="text-2xl font-bold">500+</span>
            <span className="text-sm">businesses</span>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-8 w-8" />
            <span className="text-2xl font-bold">$2M+</span>
            <span className="text-sm">processed</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
