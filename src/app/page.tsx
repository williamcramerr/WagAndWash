import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dog,
  Calendar,
  CreditCard,
  MapPin,
  Users,
  BarChart3,
  Smartphone,
  Shield,
  Star,
  CheckCircle,
  ArrowRight,
  Play,
  Sparkles,
  Clock,
  Heart,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Drag-and-drop calendar with multi-groomer views, automated reminders, and online booking.",
  },
  {
    icon: Users,
    title: "Client Management",
    description: "Complete CRM with pet profiles, grooming history, vaccination tracking, and safety flags.",
  },
  {
    icon: MapPin,
    title: "Mobile Grooming",
    description: "Route optimization, GPS tracking, and mobile check-in for on-the-go groomers.",
  },
  {
    icon: CreditCard,
    title: "Payments & Invoicing",
    description: "Accept cards, process tips, send invoices, and track every dollar automatically.",
  },
  {
    icon: BarChart3,
    title: "Reports & Analytics",
    description: "Real-time dashboards showing revenue, utilization, and client retention metrics.",
  },
  {
    icon: Smartphone,
    title: "Works Everywhere",
    description: "Beautiful on desktop, tablet, and mobile. Install as an app on any device.",
  },
];

const testimonials = [
  {
    quote: "WagAndWash transformed my business. I went from sticky notes to a fully automated booking system in a day.",
    author: "Sarah M.",
    role: "Mobile Groomer, San Francisco",
    rating: 5,
  },
  {
    quote: "The safety flags feature is a lifesaver. My team always knows which pets need extra care before they arrive.",
    author: "Mike T.",
    role: "Grooming Salon Owner, Austin",
    rating: 5,
  },
  {
    quote: "Finally, software made by people who understand pet grooming. Every feature makes sense.",
    author: "Lisa K.",
    role: "Independent Groomer, Seattle",
    rating: 5,
  },
];

const pricingPlans = [
  {
    name: "Solo",
    price: 29,
    description: "Perfect for independent groomers",
    features: [
      "Unlimited appointments",
      "Client & pet management",
      "Online booking page",
      "Payment processing",
      "Email reminders",
    ],
  },
  {
    name: "Team",
    price: 79,
    description: "For growing grooming businesses",
    features: [
      "Everything in Solo",
      "Up to 5 team members",
      "Multi-groomer calendar",
      "Route optimization",
      "Advanced reports",
      "Priority support",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: 199,
    description: "For large salons & franchises",
    features: [
      "Everything in Team",
      "Unlimited team members",
      "Multiple locations",
      "Custom integrations",
      "Dedicated account manager",
      "Custom training",
    ],
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Dog className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">WagAndWash</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
              Testimonials
            </Link>
            <Link href="/help" className="text-sm font-medium hover:text-primary transition-colors">
              Help
            </Link>
          </div>
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

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="container relative py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4" variant="secondary">
              <Sparkles className="h-3 w-3 mr-1" />
              Now with AI-powered scheduling
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              The all-in-one platform for{" "}
              <span className="text-primary">pet groomers</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Scheduling, payments, client management, and more — beautifully designed
              software that helps you focus on what you love: making pets look amazing.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/register">
                  Start Free 14-Day Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/book">
                  <Play className="mr-2 h-4 w-4" />
                  See Demo
                </Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              No credit card required • Free for 14 days • Cancel anytime
            </p>
          </div>

          {/* Hero Image/Dashboard Preview */}
          <div className="mt-16 mx-auto max-w-5xl">
            <div className="relative rounded-xl border bg-background shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent z-10 pointer-events-none" />
              {/* Fake Dashboard UI */}
              <div className="p-4 bg-muted/30">
                {/* Top Bar */}
                <div className="flex items-center justify-between mb-4 px-2">
                  <div className="flex items-center gap-2">
                    <Dog className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-sm">WagAndWash</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-32 bg-muted rounded-md" />
                    <div className="h-8 w-8 bg-primary/20 rounded-full" />
                  </div>
                </div>

                <div className="flex gap-4">
                  {/* Sidebar */}
                  <div className="hidden md:block w-48 space-y-1">
                    {["Dashboard", "Calendar", "Appointments", "Clients", "Pets", "Routes"].map((item, i) => (
                      <div
                        key={item}
                        className={`h-8 px-3 rounded-md flex items-center text-xs ${i === 0 ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground"}`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 space-y-4">
                    {/* Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { label: "Today", value: "8 appts", color: "bg-primary/10" },
                        { label: "Revenue", value: "$1,247", color: "bg-green-100" },
                        { label: "Clients", value: "156", color: "bg-blue-100" },
                        { label: "This Week", value: "$4,892", color: "bg-amber-100" },
                      ].map((stat) => (
                        <div key={stat.label} className={`${stat.color} rounded-lg p-3`}>
                          <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                          <p className="text-sm font-bold">{stat.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Calendar Preview */}
                    <div className="bg-background rounded-lg border p-3">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium">Today&apos;s Schedule</span>
                        <span className="text-[10px] text-muted-foreground">January 25, 2025</span>
                      </div>
                      <div className="space-y-2">
                        {[
                          { time: "9:00 AM", pet: "Max", service: "Full Groom", status: "done" },
                          { time: "10:30 AM", pet: "Bella", service: "Bath & Brush", status: "active" },
                          { time: "1:00 PM", pet: "Coco", service: "De-shed", status: "upcoming" },
                          { time: "3:00 PM", pet: "Duke", service: "Nail Trim", status: "upcoming" },
                        ].map((appt) => (
                          <div
                            key={appt.time}
                            className={`flex items-center gap-3 p-2 rounded-md text-xs ${
                              appt.status === "done"
                                ? "bg-muted/50 text-muted-foreground line-through"
                                : appt.status === "active"
                                ? "bg-primary/10 border border-primary/20"
                                : "bg-muted/30"
                            }`}
                          >
                            <span className="w-16 font-medium">{appt.time}</span>
                            <span className="flex-1">{appt.pet} - {appt.service}</span>
                            {appt.status === "active" && (
                              <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded">NOW</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos/Social Proof */}
      <section className="border-y bg-muted/30 py-8">
        <div className="container">
          <p className="text-center text-sm text-muted-foreground mb-6">
            Trusted by 2,000+ grooming businesses worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-50">
            {["PetSmart Partner", "Certified Groomers", "NDGAA", "IPG Member", "Pet Industry"].map((name) => (
              <div key={name} className="text-lg font-semibold text-muted-foreground">
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to run your grooming business
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From booking to payment, we&apos;ve got every step covered.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="relative overflow-hidden">
                  <CardContent className="pt-6">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-muted/30">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Get started in minutes
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              No complicated setup. No training required.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Create your account",
                description: "Sign up in 30 seconds. Import your existing clients or start fresh.",
                icon: Zap,
              },
              {
                step: "2",
                title: "Set up your services",
                description: "Add your services, pricing, and availability. We'll handle the rest.",
                icon: Sparkles,
              },
              {
                step: "3",
                title: "Start booking",
                description: "Share your booking link. Clients can book 24/7 while you sleep.",
                icon: Heart,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="text-center">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Loved by groomers everywhere
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands of happy groomers who&apos;ve transformed their business.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, i) => (
              <Card key={i} className="relative">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-lg mb-4">
                    &quot;{testimonial.quote}&quot;
                  </blockquote>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-muted/30">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Start free, upgrade when you&apos;re ready. No hidden fees.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.name}
                className={plan.popular ? "border-primary shadow-lg relative" : ""}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge>Most Popular</Badge>
                  </div>
                )}
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    asChild
                  >
                    <Link href="/register">Start Free Trial</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="link" asChild>
              <Link href="/pricing">
                Compare all features and plans
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to grow your grooming business?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join 2,000+ groomers who use WagAndWash to save time, book more clients,
              and make more money.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/register">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/book">Book a Demo</Link>
              </Button>
            </div>
            <div className="mt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                14-day free trial
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                No credit card required
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Cancel anytime
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <Dog className="h-6 w-6 text-primary" />
                <span className="font-bold">WagAndWash</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                Premium pet grooming management software for modern groomers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-foreground">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-foreground">Pricing</Link></li>
                <li><Link href="/book" className="hover:text-foreground">Demo</Link></li>
                <li><Link href="/help" className="hover:text-foreground">Help Center</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground">About</Link></li>
                <li><Link href="/blog" className="hover:text-foreground">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-foreground">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 WagAndWash. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                SOC 2 Compliant • GDPR Ready • 256-bit Encryption
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
