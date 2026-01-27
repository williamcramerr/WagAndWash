import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dog,
  CheckCircle,
  X,
  Zap,
  Users,
  Building2,
  ArrowRight,
  Shield,
  Clock,
  CreditCard,
} from "lucide-react";

const plans = [
  {
    name: "Solo",
    price: 29,
    description: "Perfect for independent groomers just getting started",
    icon: Zap,
    features: [
      { name: "Unlimited appointments", included: true },
      { name: "Client & pet management", included: true },
      { name: "Online booking page", included: true },
      { name: "Payment processing", included: true },
      { name: "Email reminders", included: true },
      { name: "Basic reports", included: true },
      { name: "1 team member", included: true },
      { name: "Multi-groomer calendar", included: false },
      { name: "Route optimization", included: false },
      { name: "Advanced analytics", included: false },
      { name: "SMS reminders", included: false },
      { name: "Priority support", included: false },
    ],
  },
  {
    name: "Team",
    price: 79,
    description: "For growing grooming businesses with a team",
    icon: Users,
    popular: true,
    features: [
      { name: "Unlimited appointments", included: true },
      { name: "Client & pet management", included: true },
      { name: "Online booking page", included: true },
      { name: "Payment processing", included: true },
      { name: "Email reminders", included: true },
      { name: "Advanced reports", included: true },
      { name: "Up to 5 team members", included: true },
      { name: "Multi-groomer calendar", included: true },
      { name: "Route optimization", included: true },
      { name: "Advanced analytics", included: true },
      { name: "SMS reminders", included: true },
      { name: "Priority support", included: true },
    ],
  },
  {
    name: "Enterprise",
    price: 199,
    description: "For large salons and franchise operations",
    icon: Building2,
    features: [
      { name: "Unlimited appointments", included: true },
      { name: "Client & pet management", included: true },
      { name: "Online booking page", included: true },
      { name: "Payment processing", included: true },
      { name: "Email reminders", included: true },
      { name: "Custom reports", included: true },
      { name: "Unlimited team members", included: true },
      { name: "Multi-groomer calendar", included: true },
      { name: "Route optimization", included: true },
      { name: "Advanced analytics", included: true },
      { name: "SMS reminders", included: true },
      { name: "Dedicated account manager", included: true },
    ],
  },
];

const faqs = [
  {
    question: "Can I try WagAndWash for free?",
    answer:
      "Yes! Every plan comes with a free 14-day trial. No credit card required. You can explore all features and decide which plan works best for your business.",
  },
  {
    question: "What happens after my trial ends?",
    answer:
      "After your 14-day trial, you can choose a plan and enter your payment details. If you decide not to continue, your account will be paused (not deleted) so you can come back anytime.",
  },
  {
    question: "Can I switch plans later?",
    answer:
      "Absolutely. You can upgrade or downgrade your plan at any time. When upgrading, you'll get immediate access to new features. Downgrades take effect at the start of your next billing cycle.",
  },
  {
    question: "Are there any setup fees or contracts?",
    answer:
      "No setup fees and no long-term contracts. All plans are month-to-month. You can cancel anytime with no cancellation fees.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit and debit cards (Visa, Mastercard, American Express). For Enterprise plans, we also offer invoicing with net-30 terms.",
  },
  {
    question: "Do you offer annual billing?",
    answer:
      "Yes! Save 20% with annual billing. That's $278/year for Solo (vs $348), $758/year for Team (vs $948), and $1,910/year for Enterprise (vs $2,388).",
  },
  {
    question: "What does 'payment processing' include?",
    answer:
      "We integrate with Stripe for payment processing. You can accept credit/debit cards, save cards on file, collect deposits, and process tips. Standard processing fees apply (2.9% + 30¢ per transaction).",
  },
  {
    question: "Can I import my existing client data?",
    answer:
      "Yes! You can import clients via CSV file on any plan. For Enterprise plans, our team will handle the migration for you at no extra cost.",
  },
];

export default function PricingPage() {
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
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Start free for 14 days. No credit card required.
            Choose the plan that fits your business.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              30-day money-back guarantee
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Cancel anytime
            </span>
            <span className="flex items-center gap-1">
              <CreditCard className="h-4 w-4" />
              No setup fees
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 -mt-8">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            {plans.map((plan) => {
              const Icon = plan.icon;
              return (
                <Card
                  key={plan.name}
                  className={
                    plan.popular
                      ? "border-primary shadow-lg relative scale-105"
                      : ""
                  }
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="px-4">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-2">
                    <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {plan.description}
                    </p>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="mb-8">
                      <span className="text-5xl font-bold">${plan.price}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>

                    <Button
                      className="w-full mb-8"
                      variant={plan.popular ? "default" : "outline"}
                      size="lg"
                      asChild
                    >
                      <Link href="/register">
                        Start Free Trial
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>

                    <ul className="space-y-3 text-left">
                      {plan.features.map((feature) => (
                        <li
                          key={feature.name}
                          className="flex items-center gap-3 text-sm"
                        >
                          {feature.included ? (
                            <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                          ) : (
                            <X className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                          )}
                          <span
                            className={
                              feature.included
                                ? ""
                                : "text-muted-foreground/60"
                            }
                          >
                            {feature.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Comparison Note */}
      <section className="py-12 bg-muted/30">
        <div className="container text-center">
          <p className="text-muted-foreground">
            All plans include: SSL encryption, automatic backups, 99.9% uptime SLA,
            and access to our knowledge base.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Frequently asked questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to grow your grooming business?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of groomers who save hours every week with WagAndWash.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/register">Start Free Trial</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-primary-foreground/30 hover:bg-primary-foreground/10"
              asChild
            >
              <Link href="/contact">Talk to Sales</Link>
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
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-foreground">
              Contact
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 WagAndWash. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
