import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dog,
  MapPin,
  Briefcase,
  Clock,
  Heart,
  Zap,
  Coffee,
  Plane,
  DollarSign,
  GraduationCap,
  ArrowRight,
  Building2,
} from "lucide-react";

const benefits = [
  { icon: DollarSign, title: "Competitive Salary", description: "Top-of-market compensation with equity" },
  { icon: Heart, title: "Health & Wellness", description: "Medical, dental, vision, and mental health support" },
  { icon: Plane, title: "Unlimited PTO", description: "Take the time you need to recharge" },
  { icon: Coffee, title: "Remote-First", description: "Work from anywhere in the US" },
  { icon: GraduationCap, title: "Learning Budget", description: "$2,000/year for courses, books, conferences" },
  { icon: Zap, title: "Latest Tech", description: "MacBook Pro, monitors, and any tools you need" },
];

const openings = [
  {
    id: 1,
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    location: "Remote (US)",
    type: "Full-time",
    description: "Build features that help thousands of groomers run their businesses. Work with Next.js, TypeScript, and PostgreSQL.",
  },
  {
    id: 2,
    title: "Product Designer",
    department: "Design",
    location: "Remote (US)",
    type: "Full-time",
    description: "Design beautiful, intuitive interfaces that groomers love. Own the end-to-end design process from research to polish.",
  },
  {
    id: 3,
    title: "Customer Success Manager",
    department: "Customer Success",
    location: "Remote (US)",
    type: "Full-time",
    description: "Help our customers succeed. Onboard new groomers, provide training, and be their advocate internally.",
  },
  {
    id: 4,
    title: "Content Marketing Manager",
    department: "Marketing",
    location: "Remote (US)",
    type: "Full-time",
    description: "Create content that educates and inspires pet groomers. Blog posts, guides, videos, and more.",
  },
];

const values = [
  "We ship fast and iterate",
  "Customer obsession is real",
  "Transparency by default",
  "Strong opinions, loosely held",
  "Work hard, rest hard",
];

export default function CareersPage() {
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
            <Badge className="mb-4">We&apos;re Hiring!</Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
              Help us build the future of pet grooming software
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Join a passionate team building tools that help thousands of groomers
              run successful businesses while making pets look amazing.
            </p>
            <Button size="lg" asChild>
              <a href="#openings">
                View Open Positions
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why join WagAndWash?</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  We&apos;re a small, fast-moving team (15 people) with the resources of a
                  well-funded startup and the ambition to become the #1 platform for pet
                  grooming businesses worldwide.
                </p>
                <p>
                  Every team member has real impact. Your code ships to production the
                  same week you write it. Your designs get used by thousands of groomers
                  the day they launch.
                </p>
                <p>
                  We&apos;re remote-first, async-friendly, and believe the best work happens
                  when people have flexibility and autonomy.
                </p>
              </div>
              <div className="mt-8">
                <h3 className="font-semibold mb-4">Our values:</h3>
                <ul className="space-y-2">
                  {values.map((value) => (
                    <li key={value} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="text-muted-foreground">{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 text-center">
                <p className="text-4xl font-bold text-primary">15</p>
                <p className="text-sm text-muted-foreground">Team members</p>
              </Card>
              <Card className="p-6 text-center">
                <p className="text-4xl font-bold text-primary">2K+</p>
                <p className="text-sm text-muted-foreground">Customers</p>
              </Card>
              <Card className="p-6 text-center">
                <p className="text-4xl font-bold text-primary">100%</p>
                <p className="text-sm text-muted-foreground">Remote</p>
              </Card>
              <Card className="p-6 text-center">
                <p className="text-4xl font-bold text-primary">$10M</p>
                <p className="text-sm text-muted-foreground">Raised</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Benefits & Perks</h2>
            <p className="text-lg text-muted-foreground">
              We take care of our team so they can take care of our customers
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <Card key={benefit.title}>
                  <CardContent className="pt-6">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="openings" className="py-24">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Open Positions</h2>
            <p className="text-lg text-muted-foreground">
              Find your next role at WagAndWash
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {openings.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{job.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline">
                          <Building2 className="h-3 w-3 mr-1" />
                          {job.department}
                        </Badge>
                        <Badge variant="outline">
                          <MapPin className="h-3 w-3 mr-1" />
                          {job.location}
                        </Badge>
                        <Badge variant="outline">
                          <Clock className="h-3 w-3 mr-1" />
                          {job.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{job.description}</p>
                    </div>
                    <Button>Apply</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Don&apos;t see a role that fits? We&apos;re always looking for talented people.
            </p>
            <Button variant="outline" asChild>
              <Link href="/contact">Send us your resume</Link>
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
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/contact" className="hover:text-foreground">Contact</Link>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 WagAndWash. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
