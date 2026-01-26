import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dog,
  Heart,
  Users,
  Award,
  MapPin,
  ArrowRight,
  Sparkles,
  Target,
  Lightbulb,
} from "lucide-react";

const team = [
  {
    name: "Emily Chen",
    role: "Founder & CEO",
    bio: "Former veterinary technician with 15 years in pet care. Started WagAndWash to solve the scheduling chaos she experienced firsthand.",
    initials: "EC",
  },
  {
    name: "Marcus Johnson",
    role: "CTO",
    bio: "Full-stack engineer who built systems at Stripe and Square. Dog dad to two rescue huskies.",
    initials: "MJ",
  },
  {
    name: "Sarah Williams",
    role: "Head of Product",
    bio: "Product leader from Calendly. Obsessed with making software that feels like magic.",
    initials: "SW",
  },
  {
    name: "David Park",
    role: "Head of Customer Success",
    bio: "10 years in SaaS customer success. Believes every groomer deserves world-class support.",
    initials: "DP",
  },
];

const values = [
  {
    icon: Heart,
    title: "Pet-First Thinking",
    description: "Every feature we build starts with one question: does this make life better for pets and the people who care for them?",
  },
  {
    icon: Lightbulb,
    title: "Simplicity Wins",
    description: "Powerful doesn&apos;t mean complicated. We obsess over making complex things feel effortless.",
  },
  {
    icon: Users,
    title: "Groomers Are Partners",
    description: "We build with groomers, not just for them. Your feedback shapes our roadmap.",
  },
  {
    icon: Target,
    title: "Relentless Improvement",
    description: "Good enough never is. We ship fast, learn faster, and never stop getting better.",
  },
];

const milestones = [
  { year: "2021", event: "Founded in San Francisco" },
  { year: "2022", event: "First 100 grooming businesses" },
  { year: "2023", event: "Launched mobile grooming features" },
  { year: "2024", event: "2,000+ businesses, $50M+ processed" },
  { year: "2025", event: "AI-powered scheduling launched" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Dog className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">WagAndWash</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Start Free Trial</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
              We&apos;re on a mission to help every groomer thrive
            </h1>
            <p className="text-xl text-muted-foreground">
              WagAndWash was born from frustration with outdated tools and a belief that
              pet groomers deserve software as beautiful as the work they do.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  In 2021, our founder Emily was running a mobile grooming business out of her van.
                  She loved the dogs but hated the admin: sticky notes for appointments, spreadsheets
                  for client info, and a calculator app for invoices.
                </p>
                <p>
                  Every software she tried was either built for salons (not mobile groomers),
                  looked like it was designed in 2005, or required a PhD to figure out.
                </p>
                <p>
                  So she teamed up with Marcus, a software engineer who shared her vision:
                  create the tool they wished existed. Beautiful, powerful, and built specifically
                  for how modern groomers actually work.
                </p>
                <p>
                  Today, WagAndWash helps thousands of groomers save hours every week, book more
                  clients, and focus on what they love—making pets look and feel amazing.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 flex items-center justify-center">
              <div className="text-center">
                <Dog className="h-24 w-24 text-primary mx-auto mb-4" />
                <p className="text-2xl font-bold">2,000+</p>
                <p className="text-muted-foreground">Grooming businesses trust us</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-lg text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <Card key={value.title}>
                  <CardContent className="pt-6">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
            <p className="text-lg text-muted-foreground">
              From a side project to serving thousands of groomers
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={milestone.year} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      {milestone.year.slice(2)}
                    </div>
                    {index < milestones.length - 1 && (
                      <div className="w-0.5 h-full bg-border mt-2" />
                    )}
                  </div>
                  <div className="pb-8">
                    <p className="font-semibold">{milestone.year}</p>
                    <p className="text-muted-foreground">{milestone.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Meet the Team</h2>
            <p className="text-lg text-muted-foreground">
              The people building the future of grooming software
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <Card key={member.name}>
                <CardContent className="pt-6 text-center">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">{member.initials}</span>
                  </div>
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-primary mb-2">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <Sparkles className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">
              Ready to join 2,000+ thriving groomers?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Start your free 14-day trial today. No credit card required.
            </p>
            <Button size="lg" asChild>
              <Link href="/register">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Dog className="h-6 w-6 text-primary" />
            <span className="font-bold">WagAndWash</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            © 2025 WagAndWash. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
