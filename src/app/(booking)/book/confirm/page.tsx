"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  Dog,
  User,
  Phone,
  Mail,
  CalendarPlus,
  Share2,
  Printer,
  Edit,
  Home,
  Scissors,
  DollarSign,
} from "lucide-react";
import { format, addDays } from "date-fns";

// Mock booking data (in real app, this would come from URL params or API)
const mockBooking = {
  confirmationNumber: "WW-2025-0125-001",
  status: "confirmed",
  date: addDays(new Date(), 3),
  time: "10:00 AM",
  duration: 90,
  location: "salon", // or "mobile"
  service: {
    name: "Full Groom",
    price: 85,
  },
  pet: {
    name: "Max",
    breed: "Golden Retriever",
  },
  groomer: {
    name: "Lisa Martinez",
  },
  client: {
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "(555) 123-4567",
  },
  deposit: 25,
  totalDue: 60,
};

export default function BookingConfirmationPage() {
  const [copied, setCopied] = React.useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddToCalendar = (type: "google" | "apple" | "outlook") => {
    // In a real app, this would generate the appropriate calendar link
    console.log(`Adding to ${type} calendar`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100"
          >
            <CheckCircle className="h-12 w-12 text-green-600" />
          </motion.div>
          <h1 className="text-3xl font-bold">Booking Confirmed!</h1>
          <p className="text-muted-foreground">
            We&apos;ve sent a confirmation email to{" "}
            <span className="font-medium text-foreground">{mockBooking.client.email}</span>
          </p>
          <div className="inline-flex items-center gap-2 bg-muted px-4 py-2 rounded-lg">
            <span className="text-sm text-muted-foreground">Confirmation #</span>
            <span className="font-mono font-semibold">{mockBooking.confirmationNumber}</span>
          </div>
        </motion.div>

        {/* Booking Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Appointment Details</CardTitle>
                <Badge variant="default" className="bg-green-100 text-green-700">
                  Confirmed
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">
                      {format(mockBooking.date, "EEEE, MMMM d, yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium">
                      {mockBooking.time} ({mockBooking.duration} min)
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Service & Pet */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Scissors className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Service</p>
                    <p className="font-medium">{mockBooking.service.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Dog className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pet</p>
                    <p className="font-medium">
                      {mockBooking.pet.name} ({mockBooking.pet.breed})
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Location & Groomer */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">
                      {mockBooking.location === "salon" ? "Salon Visit" : "Mobile (We come to you)"}
                    </p>
                    {mockBooking.location === "salon" && (
                      <p className="text-sm text-muted-foreground">
                        123 Pet Lane, Springfield
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Groomer</p>
                    <p className="font-medium">{mockBooking.groomer.name}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Payment Summary */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{mockBooking.service.name}</span>
                  <span>${mockBooking.service.price}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600">
                  <span>Deposit paid</span>
                  <span>-${mockBooking.deposit}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Due at appointment</span>
                  <span>${mockBooking.totalDue}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Add to Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add to Calendar</CardTitle>
              <CardDescription>
                Never miss your appointment - add it to your calendar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleAddToCalendar("google")}
                  className="gap-2"
                >
                  <CalendarPlus className="h-4 w-4" />
                  Google Calendar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleAddToCalendar("apple")}
                  className="gap-2"
                >
                  <CalendarPlus className="h-4 w-4" />
                  Apple Calendar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleAddToCalendar("outlook")}
                  className="gap-2"
                >
                  <CalendarPlus className="h-4 w-4" />
                  Outlook
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* What to Expect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What to Expect</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Arrive 5-10 minutes early</strong> to allow time for check-in
                    and a quick chat about {mockBooking.pet.name}&apos;s needs
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Bring vaccination records</strong> if this is your first visit
                    or if they&apos;ve been updated recently
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Let us know about any concerns</strong> - allergies, sensitive
                    areas, or behavioral notes help us provide the best care
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>We&apos;ll text when ready</strong> - relax and we&apos;ll let
                    you know when {mockBooking.pet.name} is looking fabulous!
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap gap-3 justify-center"
        >
          <Button variant="outline" onClick={handleCopyLink} className="gap-2">
            <Share2 className="h-4 w-4" />
            {copied ? "Copied!" : "Share Link"}
          </Button>
          <Button variant="outline" className="gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Link href="/book">
            <Button variant="outline" className="gap-2">
              <Edit className="h-4 w-4" />
              Reschedule
            </Button>
          </Link>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-sm text-muted-foreground border-t pt-8"
        >
          <p className="mb-2">Questions about your appointment?</p>
          <div className="flex justify-center gap-4">
            <a href="tel:5551234567" className="flex items-center gap-1 hover:text-primary">
              <Phone className="h-4 w-4" />
              (555) 123-4567
            </a>
            <a href="mailto:hello@wagandwash.com" className="flex items-center gap-1 hover:text-primary">
              <Mail className="h-4 w-4" />
              hello@wagandwash.com
            </a>
          </div>
        </motion.div>

        {/* Back Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <Link href="/book">
            <Button variant="ghost" className="gap-2">
              <Home className="h-4 w-4" />
              Book Another Appointment
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
