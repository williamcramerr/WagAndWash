"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/status-badge";
import { PetAvatar } from "@/components/ui/pet-avatar";
import { PriceDisplay, PriceSummary } from "@/components/ui/price-display";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  Edit,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Printer,
  Send,
  Trash2,
  Play,
  Pause,
  Scissors,
  CreditCard,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import {
  appointments,
  getClientById,
  getPetById,
  getGroomerById,
  getServiceById,
  type Appointment,
  type AppointmentStatus,
} from "@/lib/mock-data";

const statusActions: Record<AppointmentStatus, { next: AppointmentStatus; label: string; icon: React.ReactNode }[]> = {
  pending: [
    { next: "confirmed", label: "Confirm", icon: <CheckCircle className="h-4 w-4" /> },
    { next: "canceled", label: "Cancel", icon: <XCircle className="h-4 w-4" /> },
  ],
  confirmed: [
    { next: "checked_in", label: "Check In", icon: <Play className="h-4 w-4" /> },
    { next: "canceled", label: "Cancel", icon: <XCircle className="h-4 w-4" /> },
  ],
  checked_in: [
    { next: "in_progress", label: "Start Grooming", icon: <Scissors className="h-4 w-4" /> },
    { next: "no_show", label: "No Show", icon: <XCircle className="h-4 w-4" /> },
  ],
  in_progress: [
    { next: "completed", label: "Complete", icon: <CheckCircle className="h-4 w-4" /> },
  ],
  completed: [],
  no_show: [],
  canceled: [],
};

export default function AppointmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const [appointment, setAppointment] = React.useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [notes, setNotes] = React.useState("");
  const [showCancelDialog, setShowCancelDialog] = React.useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = React.useState(false);

  React.useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      const found = appointments.find((a) => a.id === params.id);
      setAppointment(found || null);
      setNotes(found?.notes || "");
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Appointment not found</h2>
        <p className="text-muted-foreground mb-4">
          The appointment you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/appointments">
          <Button>Back to Appointments</Button>
        </Link>
      </div>
    );
  }

  const client = getClientById(appointment.clientId);
  const groomer = getGroomerById(appointment.groomerId);
  const pets = appointment.services.map((s) => ({
    pet: getPetById(s.petId),
    service: getServiceById(s.serviceId),
    price: s.price,
  }));

  const handleStatusChange = async (newStatus: AppointmentStatus) => {
    if (newStatus === "canceled") {
      setShowCancelDialog(true);
      return;
    }

    setIsUpdating(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setAppointment((prev) => prev ? { ...prev, status: newStatus } : null);
    toast({
      title: "Status updated",
      description: `Appointment marked as ${newStatus.replace("_", " ")}.`,
    });
    setIsUpdating(false);

    if (newStatus === "completed") {
      setShowPaymentDialog(true);
    }
  };

  const handleCancel = async () => {
    setIsUpdating(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setAppointment((prev) => prev ? { ...prev, status: "canceled" } : null);
    setShowCancelDialog(false);
    toast({
      title: "Appointment canceled",
      description: "The appointment has been canceled.",
    });
    setIsUpdating(false);
  };

  const handleSaveNotes = async () => {
    setIsUpdating(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    setAppointment((prev) => prev ? { ...prev, notes } : null);
    toast({
      title: "Notes saved",
      description: "Appointment notes have been updated.",
    });
    setIsUpdating(false);
  };

  const subtotal = appointment.services.reduce((sum, s) => sum + s.price, 0);
  const availableActions = statusActions[appointment.status];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link href="/appointments">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">
                {client?.firstName} {client?.lastName}
              </h1>
              <StatusBadge status={appointment.status} />
            </div>
            <p className="text-muted-foreground">
              {format(new Date(appointment.startTime), "EEEE, MMMM d, yyyy")} at{" "}
              {format(new Date(appointment.startTime), "h:mm a")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {availableActions.map((action) => (
            <Button
              key={action.next}
              variant={action.next === "canceled" ? "outline" : "default"}
              onClick={() => handleStatusChange(action.next)}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <span className="mr-2">{action.icon}</span>
              )}
              {action.label}
            </Button>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Edit Appointment
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Calendar className="h-4 w-4 mr-2" />
                Reschedule
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Printer className="h-4 w-4 mr-2" />
                Print Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Send className="h-4 w-4 mr-2" />
                Send Reminder
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => setShowCancelDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Cancel Appointment
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Services */}
          <Card>
            <CardHeader>
              <CardTitle>Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pets.map(({ pet, service, price }, index) => (
                <div key={index}>
                  {index > 0 && <Separator className="my-4" />}
                  <div className="flex items-start gap-4">
                    <PetAvatar
                      name={pet?.name || "Unknown"}
                      species={pet?.species || "dog"}
                      size="lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link
                            href={`/pets/${pet?.id}`}
                            className="font-medium hover:underline"
                          >
                            {pet?.name}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            {pet?.breed}
                          </p>
                        </div>
                        <PriceDisplay amount={price} className="text-lg font-semibold" />
                      </div>
                      <p className="mt-1 text-sm">{service?.name}</p>
                      {pet?.safetyFlags && pet.safetyFlags.length > 0 && (
                        <div className="flex items-center gap-2 mt-2">
                          <AlertTriangle className="h-4 w-4 text-warning" />
                          <div className="flex gap-1">
                            {pet.safetyFlags.map((flag) => (
                              <Badge key={flag.type} variant="outline" className="text-xs">
                                {flag.type.replace("_", " ")}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <Separator className="my-4" />

              <div className="flex justify-between items-center">
                <span className="font-medium">Total</span>
                <PriceDisplay amount={subtotal} className="text-xl font-bold" />
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Add notes about this appointment..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
              <Button
                onClick={handleSaveNotes}
                disabled={isUpdating || notes === appointment.notes}
                size="sm"
              >
                {isUpdating ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Save Notes
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Client Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Client
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {client?.firstName?.[0]}
                    {client?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Link
                    href={`/clients/${client?.id}`}
                    className="font-medium hover:underline"
                  >
                    {client?.firstName} {client?.lastName}
                  </Link>
                </div>
              </div>

              <Separator />

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${client?.phone}`} className="hover:underline">
                    {client?.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${client?.email}`} className="hover:underline">
                    {client?.email}
                  </a>
                </div>
                {client?.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>
                      {client.address.street}
                      <br />
                      {client.address.city}, {client.address.state} {client.address.zip}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Groomer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scissors className="h-5 w-5" />
                Groomer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {groomer?.firstName?.[0]}{groomer?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{groomer?.firstName} {groomer?.lastName}</p>
                  <p className="text-sm text-muted-foreground">
                    {groomer?.specialties?.join(", ")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appointment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">
                  {format(new Date(appointment.startTime), "MMM d, yyyy")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time</span>
                <span className="font-medium">
                  {format(new Date(appointment.startTime), "h:mm a")} - {format(new Date(appointment.endTime), "h:mm a")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium">
                  {Math.round((new Date(appointment.endTime).getTime() - new Date(appointment.startTime).getTime()) / 60000)} min
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location</span>
                <span className="font-medium capitalize">{appointment.isMobile ? "Mobile" : "Salon"}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Keep Appointment
            </Button>
            <Button variant="destructive" onClick={handleCancel} disabled={isUpdating}>
              {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Cancel Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Collect Payment</DialogTitle>
            <DialogDescription>
              The appointment is complete. Would you like to collect payment now?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <PriceSummary
              items={[
                ...pets.map(({ pet, service, price }) => ({
                  label: `${service?.name} - ${pet?.name}`,
                  amount: price,
                })),
                { label: "Total", amount: subtotal, isTotal: true },
              ]}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              Later
            </Button>
            <Button onClick={() => {
              setShowPaymentDialog(false);
              toast({ title: "Opening checkout...", description: "Redirecting to payment." });
            }}>
              <CreditCard className="h-4 w-4 mr-2" />
              Collect Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
