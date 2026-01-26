"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn, formatCurrency } from "@/lib/utils";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Scissors,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  Edit,
  Dog,
} from "lucide-react";
import { format, addDays } from "date-fns";

type BookingStatus = "confirmed" | "canceled";

// Mock booking for demo
const mockBooking: {
  id: string;
  confirmationCode: string;
  status: BookingStatus;
  client: { firstName: string; lastName: string; email: string; phone: string };
  pet: { name: string; breed: string; species: string };
  service: { name: string; price: number };
  appointment: { date: string; time: string; duration: number; groomer: string };
  address: { street: string; city: string; state: string; zip: string };
  isMobile: boolean;
  depositPaid: number;
  createdAt: string;
} = {
  id: "bk_123456",
  confirmationCode: "WW-2025-ABC123",
  status: "confirmed",
  client: {
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@email.com",
    phone: "(555) 987-6001",
  },
  pet: {
    name: "Max",
    breed: "Golden Retriever",
    species: "dog",
  },
  service: {
    name: "Full Groom",
    price: 85,
  },
  appointment: {
    date: addDays(new Date(), 3).toISOString(),
    time: "10:00 AM",
    duration: 90,
    groomer: "Lisa Martinez",
  },
  address: {
    street: "123 Oak Street",
    city: "Springfield",
    state: "CA",
    zip: "90210",
  },
  isMobile: true,
  depositPaid: 25,
  createdAt: new Date().toISOString(),
};

export default function ManageBookingPage() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const [lookupCode, setLookupCode] = React.useState(code || "");
  const [booking, setBooking] = React.useState(code ? mockBooking : null);
  const [showCancelDialog, setShowCancelDialog] = React.useState(false);
  const [isCanceling, setIsCanceling] = React.useState(false);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock lookup - in real app would fetch from API
    if (lookupCode.toUpperCase() === "WW-2025-ABC123" || lookupCode) {
      setBooking(mockBooking);
    }
  };

  const handleCancel = async () => {
    setIsCanceling(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setBooking((prev) => prev ? { ...prev, status: "canceled" as BookingStatus } : null);
    setShowCancelDialog(false);
    setIsCanceling(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container max-w-2xl py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/book" className="inline-flex items-center gap-2 text-primary hover:underline mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Booking
          </Link>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Dog className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">WagAndWash</h1>
          </div>
          <p className="text-muted-foreground">Manage Your Appointment</p>
        </div>

        {!booking ? (
          /* Lookup Form */
          <Card>
            <CardHeader>
              <CardTitle>Find Your Booking</CardTitle>
              <CardDescription>
                Enter your confirmation code to view or manage your appointment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLookup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Confirmation Code</Label>
                  <Input
                    id="code"
                    value={lookupCode}
                    onChange={(e) => setLookupCode(e.target.value)}
                    placeholder="e.g., WW-2025-ABC123"
                    className="text-center text-lg tracking-wider"
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    Check your confirmation email for the code
                  </p>
                </div>
                <Button type="submit" className="w-full">
                  Find Booking
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Can&apos;t find your code?
                </p>
                <Button variant="link" className="text-primary">
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Booking Details */
          <div className="space-y-6">
            {/* Status Banner */}
            <Card className={cn(
              booking.status === "confirmed" && "border-green-200 bg-green-50",
              booking.status === "canceled" && "border-red-200 bg-red-50"
            )}>
              <CardContent className="py-4">
                <div className="flex items-center justify-center gap-2">
                  {booking.status === "confirmed" ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-700">Appointment Confirmed</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-red-600" />
                      <span className="font-medium text-red-700">Appointment Canceled</span>
                    </>
                  )}
                </div>
                <p className="text-center text-sm text-muted-foreground mt-1">
                  Confirmation: {booking.confirmationCode}
                </p>
              </CardContent>
            </Card>

            {/* Appointment Details */}
            <Card>
              <CardHeader>
                <CardTitle>Appointment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Date & Time */}
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {format(new Date(booking.appointment.date), "EEEE, MMMM d, yyyy")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {booking.appointment.time} • {booking.appointment.duration} minutes
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Service & Pet */}
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                    <Scissors className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium">{booking.service.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.pet.name} ({booking.pet.breed})
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {booking.isMobile ? "Mobile Grooming" : "In-Salon"}
                    </p>
                    {booking.isMobile && (
                      <p className="text-sm text-muted-foreground">
                        {booking.address.street}<br />
                        {booking.address.city}, {booking.address.state} {booking.address.zip}
                      </p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Groomer */}
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0 font-medium">
                    {booking.appointment.groomer.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-medium">{booking.appointment.groomer}</p>
                    <p className="text-sm text-muted-foreground">Your Groomer</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{booking.service.name}</span>
                    <span>{formatCurrency(booking.service.price)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Deposit Paid</span>
                    <span>-{formatCurrency(booking.depositPaid)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium text-lg">
                    <span>Due at Appointment</span>
                    <span>{formatCurrency(booking.service.price - booking.depositPaid)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            {booking.status === "confirmed" && (
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" asChild>
                  <Link href="/book">
                    <Edit className="h-4 w-4 mr-2" />
                    Reschedule
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => setShowCancelDialog(true)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}

            {/* Contact Info */}
            <Card>
              <CardContent className="py-4">
                <p className="text-sm text-muted-foreground text-center mb-3">
                  Questions about your appointment?
                </p>
                <div className="flex justify-center gap-4">
                  <Button variant="outline" size="sm" asChild>
                    <a href="tel:1-800-924-9274">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Us
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="mailto:support@wagandwash.com">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Cancel Dialog */}
        <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Appointment?</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel your appointment on{" "}
                {booking && format(new Date(booking.appointment.date), "MMMM d")}?
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-800">Cancellation Policy</p>
                  <p className="text-amber-700">
                    Cancellations within 24 hours of the appointment may forfeit the deposit.
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                Keep Appointment
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancel}
                disabled={isCanceling}
              >
                {isCanceling ? "Canceling..." : "Cancel Appointment"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
