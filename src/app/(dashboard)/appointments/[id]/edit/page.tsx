"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  appointments,
  getClientById,
  getPetById,
  getGroomerById,
  getServiceById,
  services,
  groomers,
} from "@/lib/mock-data";
import {
  ArrowLeft,
  Save,
  Loader2,
  Calendar as CalendarIcon,
  Clock,
  User,
  Dog,
  Scissors,
  AlertTriangle,
  Trash2,
  MapPin,
} from "lucide-react";
import { format, setHours, setMinutes, addMinutes } from "date-fns";
import { cn } from "@/lib/utils";

const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30",
];

export default function EditAppointmentPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const appointment = appointments.find((a) => a.id === params.id);
  const client = appointment ? getClientById(appointment.clientId) : null;

  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    appointment ? new Date(appointment.startTime) : undefined
  );
  const [formData, setFormData] = React.useState({
    groomerId: appointment?.groomerId || "",
    startTime: appointment ? format(new Date(appointment.startTime), "HH:mm") : "09:00",
    notes: appointment?.notes || "",
    internalNotes: appointment?.internalNotes || "",
    isMobile: appointment?.isMobile || false,
    address: {
      street: appointment?.address?.street || client?.address?.street || "",
      city: appointment?.address?.city || client?.address?.city || "",
      state: appointment?.address?.state || client?.address?.state || "",
      zip: appointment?.address?.zip || client?.address?.zip || "",
    },
  });

  if (!appointment || !client) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-semibold">Appointment not found</h2>
        <p className="text-muted-foreground mt-2">This appointment does not exist or has been removed.</p>
        <Button asChild className="mt-4">
          <Link href="/appointments">Back to Appointments</Link>
        </Button>
      </div>
    );
  }

  const pets = appointment.services.map((s) => ({
    pet: getPetById(s.petId),
    service: getServiceById(s.serviceId),
    price: s.price,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Appointment updated",
      description: "The appointment has been rescheduled successfully.",
    });

    setIsLoading(false);
    router.push(`/appointments/${params.id}`);
  };

  const handleCancel = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    toast({
      title: "Appointment canceled",
      description: "The appointment has been canceled.",
      variant: "destructive",
    });

    router.push("/appointments");
  };

  const totalDuration = appointment.services.reduce((sum, s) => sum + s.duration, 0);
  const endTime = selectedDate
    ? format(
        addMinutes(
          setMinutes(
            setHours(selectedDate, parseInt(formData.startTime.split(":")[0])),
            parseInt(formData.startTime.split(":")[1])
          ),
          totalDuration
        ),
        "h:mm a"
      )
    : "";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Appointment"
        description={`${client.firstName} ${client.lastName}`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/appointments/${params.id}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Cancel
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Cancel Appointment
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel this appointment?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will cancel the appointment for {client.firstName} {client.lastName}.
                    The client will be notified of the cancellation.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCancel} className="bg-destructive text-destructive-foreground">
                    Cancel Appointment
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Services Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scissors className="h-5 w-5" />
              Services
            </CardTitle>
            <CardDescription>Services scheduled for this appointment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pets.map(({ pet, service, price }, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {pet?.species === "dog" ? "🐕" : "🐈"}
                    </div>
                    <div>
                      <p className="font-medium">{pet?.name}</p>
                      <p className="text-sm text-muted-foreground">{service?.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${price.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">
                      {service?.baseDuration} min
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              To modify services, please cancel this appointment and create a new one.
            </p>
          </CardContent>
        </Card>

        {/* Date & Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Date & Time
            </CardTitle>
            <CardDescription>Reschedule the appointment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Start Time</Label>
                <Select
                  value={formData.startTime}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, startTime: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {format(
                          setMinutes(
                            setHours(new Date(), parseInt(time.split(":")[0])),
                            parseInt(time.split(":")[1])
                          ),
                          "h:mm a"
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">
                  {formData.startTime && format(
                    setMinutes(
                      setHours(new Date(), parseInt(formData.startTime.split(":")[0])),
                      parseInt(formData.startTime.split(":")[1])
                    ),
                    "h:mm a"
                  )}{" "}
                  - {endTime}
                </p>
                <p className="text-sm text-muted-foreground">
                  Duration: {totalDuration} minutes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Groomer */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Groomer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={formData.groomerId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, groomerId: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select groomer" />
              </SelectTrigger>
              <SelectContent>
                {groomers.filter((g) => g.isActive).map((groomer) => (
                  <SelectItem key={groomer.id} value={groomer.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: groomer.color }}
                      />
                      {groomer.firstName} {groomer.lastName}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Location (for mobile appointments) */}
        {formData.isMobile && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location
              </CardTitle>
              <CardDescription>Mobile grooming address</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  value={formData.address.street}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      address: { ...prev.address, street: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.address.city}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        address: { ...prev.address, city: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.address.state}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        address: { ...prev.address, state: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP</Label>
                  <Input
                    id="zip"
                    value={formData.address.zip}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        address: { ...prev.address, zip: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Client Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Notes visible to the client..."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="internalNotes">Internal Notes</Label>
              <Textarea
                id="internalNotes"
                value={formData.internalNotes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, internalNotes: e.target.value }))
                }
                placeholder="Private notes for staff only..."
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" asChild>
            <Link href={`/appointments/${params.id}`}>Cancel</Link>
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
