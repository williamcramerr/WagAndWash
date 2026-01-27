"use client";

import * as React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
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
  Search,
  Book,
  Video,
  MessageCircle,
  Mail,
  Phone,
  ExternalLink,
  Calendar,
  Users,
  CreditCard,
  Dog,
  MapPin,
  Settings,
  ChevronRight,
} from "lucide-react";

const helpCategories = [
  {
    title: "Getting Started",
    icon: Book,
    description: "Learn the basics of WagAndWash",
    articles: 8,
    href: "#getting-started",
  },
  {
    title: "Appointments",
    icon: Calendar,
    description: "Booking, scheduling, and calendar management",
    articles: 12,
    href: "#appointments",
  },
  {
    title: "Clients & Pets",
    icon: Users,
    description: "Managing your client database",
    articles: 10,
    href: "#clients",
  },
  {
    title: "Mobile Grooming",
    icon: MapPin,
    description: "Route planning and mobile operations",
    articles: 6,
    href: "#mobile",
  },
  {
    title: "Payments",
    icon: CreditCard,
    description: "Billing, invoices, and tips",
    articles: 9,
    href: "#payments",
  },
  {
    title: "Settings",
    icon: Settings,
    description: "Configuration and customization",
    articles: 7,
    href: "#settings",
  },
];

const faqs = [
  {
    question: "How do I add a new client?",
    answer: "Go to the Clients page and click the 'Add Client' button. Fill in the client's contact information, then add their pets. You can also quickly add clients during the booking process.",
  },
  {
    question: "Can I book multiple pets in one appointment?",
    answer: "Yes! When creating an appointment, you can select multiple pets belonging to the same client. Each pet can have different services, and the appointment duration will automatically adjust.",
  },
  {
    question: "How do I set up my service prices?",
    answer: "Navigate to Settings > Services to manage your service catalog. You can set base prices, add size modifiers (small, medium, large, x-large), and configure coat type add-ons.",
  },
  {
    question: "How does route optimization work?",
    answer: "The Routes page shows all mobile appointments for the day. Click 'Optimize Route' to automatically arrange stops in the most efficient order based on driving time and appointment windows.",
  },
  {
    question: "Can clients book online?",
    answer: "Yes! Share your booking link (found in Settings > Booking) with clients. They can select services, choose available times, and pay deposits online.",
  },
  {
    question: "How do I collect payments?",
    answer: "You can collect payments at checkout after completing an appointment. We support card payments, cash, and checks. Tips can be added during checkout as well.",
  },
  {
    question: "What happens when a vaccination expires?",
    answer: "WagAndWash tracks vaccination dates for each pet. You'll receive a notification when vaccinations are expiring, and can choose to remind the client or require updated records before their next appointment.",
  },
  {
    question: "How do I add team members?",
    answer: "Go to Team settings to add groomers and staff. You can assign different roles (Owner, Manager, Groomer) with appropriate permissions, set schedules, and track individual performance.",
  },
];

const videoTutorials = [
  { title: "Quick Start Guide", duration: "5:30", thumbnail: "📹" },
  { title: "Managing Your Calendar", duration: "8:15", thumbnail: "📅" },
  { title: "Setting Up Services", duration: "6:45", thumbnail: "✂️" },
  { title: "Mobile Grooming Tips", duration: "10:20", thumbnail: "🚐" },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <div className="space-y-8">
      <PageHeader
        title="Help Center"
        description="Find answers, tutorials, and get support"
      />

      {/* Search */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-2">How can we help you?</h2>
            <p className="text-muted-foreground mb-6">
              Search our knowledge base or browse categories below
            </p>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help articles..."
                className="pl-12 h-12 text-lg"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Help Categories */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Browse by Topic</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {helpCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Card key={category.title} className="hover:bg-accent/50 transition-colors cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{category.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {category.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {category.articles} articles
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

      {/* FAQs */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>Quick answers to common questions</CardDescription>
        </CardHeader>
        <CardContent>
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

      {/* Video Tutorials */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Video Tutorials
              </CardTitle>
              <CardDescription>Learn with step-by-step video guides</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {videoTutorials.map((video, index) => (
              <div
                key={index}
                className="group cursor-pointer"
              >
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center text-4xl mb-2 group-hover:bg-muted/80 transition-colors">
                  {video.thumbnail}
                </div>
                <p className="font-medium text-sm">{video.title}</p>
                <p className="text-xs text-muted-foreground">{video.duration}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <h4 className="font-semibold mb-1">Live Chat</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Chat with our support team
            </p>
            <Button className="w-full">Start Chat</Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h4 className="font-semibold mb-1">Email Support</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Get help via email
            </p>
            <Button variant="outline" className="w-full" asChild>
              <a href="mailto:support@wagandwash.com">
                support@wagandwash.com
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <h4 className="font-semibold mb-1">Phone Support</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Mon-Fri, 9am-5pm PST
            </p>
            <Button variant="outline" className="w-full" asChild>
              <a href="tel:1-800-WAG-WASH">
                1-800-WAG-WASH
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="#"
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
            >
              <Book className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Documentation</p>
                <p className="text-sm text-muted-foreground">
                  Full product documentation
                </p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto" />
            </a>
            <a
              href="#"
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
            >
              <Dog className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Groomer Community</p>
                <p className="text-sm text-muted-foreground">
                  Join our Facebook group
                </p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto" />
            </a>
            <a
              href="#"
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
            >
              <Video className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">YouTube Channel</p>
                <p className="text-sm text-muted-foreground">
                  Tutorials and tips
                </p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto" />
            </a>
            <a
              href="#"
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
            >
              <MessageCircle className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Feature Requests</p>
                <p className="text-sm text-muted-foreground">
                  Vote on upcoming features
                </p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto" />
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
