import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dog,
  Search,
  Book,
  MessageCircle,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Users,
  Sparkles,
  Shield,
  ChevronRight,
} from "lucide-react";

const helpCategories = [
  {
    title: "Getting Started",
    icon: Book,
    description: "Learn how WagAndWash can transform your grooming business",
    href: "#getting-started",
  },
  {
    title: "Pricing & Plans",
    icon: CreditCard,
    description: "Understand our pricing tiers and what's included",
    href: "#pricing",
  },
  {
    title: "Features",
    icon: Sparkles,
    description: "Explore all the features available in WagAndWash",
    href: "#features",
  },
  {
    title: "Account & Billing",
    icon: Users,
    description: "Manage your subscription and billing information",
    href: "#billing",
  },
  {
    title: "Security & Privacy",
    icon: Shield,
    description: "How we protect your data and your clients' information",
    href: "#security",
  },
  {
    title: "Integrations",
    icon: Calendar,
    description: "Connect WagAndWash with other tools you use",
    href: "#integrations",
  },
];

const faqs = [
  {
    question: "What is WagAndWash?",
    answer: "WagAndWash is an all-in-one business management platform designed specifically for pet groomers. It handles scheduling, client management, payments, route planning for mobile groomers, and much more.",
  },
  {
    question: "How much does WagAndWash cost?",
    answer: "We offer flexible pricing starting at $29/month for solo groomers. Our Professional plan is $79/month and includes unlimited team members. All plans include a free 14-day trial with no credit card required.",
  },
  {
    question: "Do I need any special equipment?",
    answer: "No special equipment is required. WagAndWash works on any device with a web browser - your computer, tablet, or smartphone. For mobile groomers, we recommend a tablet or smartphone for on-the-go access.",
  },
  {
    question: "Can my clients book appointments online?",
    answer: "Yes! WagAndWash includes a customizable online booking page that you can share with clients or embed on your website. Clients can see your availability, select services, and book appointments 24/7.",
  },
  {
    question: "How do I accept payments?",
    answer: "WagAndWash integrates with Stripe for card payments. You can accept credit/debit cards, save cards on file for repeat clients, and even collect deposits for bookings. Cash and check payments can also be recorded.",
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We use bank-level encryption for all data transmission and storage. Your data is backed up daily, and we're fully compliant with data protection regulations. You always maintain ownership of your data.",
  },
  {
    question: "Can I import my existing client list?",
    answer: "Yes! You can import clients from a CSV file or we can help migrate your data from other grooming software. Our support team is happy to assist with data migration at no extra cost.",
  },
  {
    question: "What kind of support do you offer?",
    answer: "We provide email support on all plans, with live chat and phone support available on Professional plans and above. We also have an extensive knowledge base, video tutorials, and a community forum.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes, you can cancel your subscription at any time with no cancellation fees. If you cancel, you'll continue to have access until the end of your current billing period. We also offer a 30-day money-back guarantee.",
  },
  {
    question: "Do you offer a mobile app?",
    answer: "WagAndWash is a progressive web app (PWA) that works beautifully on mobile devices. You can add it to your home screen for an app-like experience. Native iOS and Android apps are on our roadmap.",
  },
];

export default function PublicHelpPage() {
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
      <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Help Center</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Find answers to your questions and learn how to get the most out of WagAndWash
            </p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for help articles..."
                className="pl-12 h-12 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-12">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Browse by Topic</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {helpCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Card
                  key={category.title}
                  className="hover:bg-accent/50 transition-colors cursor-pointer"
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{category.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {category.description}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <Card>
              <CardContent className="pt-6">
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
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-12">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8 text-center">Still need help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">Live Chat</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Chat with our team during business hours
                </p>
                <Button className="w-full">Start Chat</Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">Email Support</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  We&apos;ll respond within 24 hours
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <a href="mailto:support@wagandwash.com">Send Email</a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">Phone Support</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Mon-Fri, 9am-5pm PST
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <a href="tel:1-800-924-9274">1-800-WAG-WASH</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of groomers who trust WagAndWash to run their business.
            Start your free 14-day trial today.
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
              <Link href="/book">Book a Demo</Link>
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
