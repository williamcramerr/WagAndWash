"use client";

import * as React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { CalendarHeader } from "./components/calendar-header";
import { WeekView } from "./components/week-view";
import { DayView } from "./components/day-view";
import { AppointmentCard } from "./components/appointment-block";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/ui/status-badge";
import { PetAvatar } from "@/components/ui/pet-avatar";
import { PriceDisplay, PriceSummary } from "@/components/ui/price-display";
import { startOfWeek, format } from "date-fns";
import { Plus, Phone, Mail, MapPin, Clock, User, Scissors } from "lucide-react";
import {
  getAppointmentsForWeek,
  getAppointmentsByDate,
  getClientById,
  getPetById,
  getGroomerById,
  getServiceById,
  type Appointment,
} from "@/lib/mock-data";
import Link from "next/link";

type CalendarView = "day" | "week" | "month";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [view, setView] = React.useState<CalendarView>("week");
  const [selectedGroomers, setSelectedGroomers] = React.useState<string[]>([]);
  const [selectedAppointment, setSelectedAppointment] = React.useState<Appointment | null>(null);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const appointments = view === "week"
    ? getAppointmentsForWeek(weekStart)
    : getAppointmentsByDate(currentDate);

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Calendar"
        description="Manage your grooming schedule"
        actions={
          <Button asChild>
            <Link href="/appointments/new">
              <Plus className="h-4 w-4 mr-2" />
              New Appointment
            </Link>
          </Button>
        }
      />

      <CalendarHeader
        currentDate={view === "week" ? weekStart : currentDate}
        onDateChange={setCurrentDate}
        view={view}
        onViewChange={setView}
        selectedGroomers={selectedGroomers}
        onGroomerChange={setSelectedGroomers}
      />

      {view === "week" && (
        <WeekView
          currentDate={weekStart}
          appointments={appointments}
          selectedGroomers={selectedGroomers}
          onAppointmentClick={handleAppointmentClick}
        />
      )}

      {view === "day" && (
        <DayView
          currentDate={currentDate}
          appointments={appointments}
          selectedGroomers={selectedGroomers}
          onAppointmentClick={handleAppointmentClick}
        />
      )}

      {view === "month" && (
        <div className="flex items-center justify-center h-[400px] border rounded-lg bg-muted/30">
          <p className="text-muted-foreground">Month view coming soon</p>
        </div>
      )}

      {/* Appointment Detail Sheet */}
      <AppointmentDetailSheet
        appointment={selectedAppointment}
        open={!!selectedAppointment}
        onOpenChange={(open) => !open && setSelectedAppointment(null)}
      />
    </div>
  );
}

interface AppointmentDetailSheetProps {
  appointment: Appointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function AppointmentDetailSheet({
  appointment,
  open,
  onOpenChange,
}: AppointmentDetailSheetProps) {
  if (!appointment) return null;

  const client = getClientById(appointment.clientId);
  const groomer = getGroomerById(appointment.groomerId);
  const pets = appointment.services.map((s) => getPetById(s.petId)).filter(Boolean);

  const priceItems = [
    ...appointment.services.map((s) => {
      const service = getServiceById(s.serviceId);
      const pet = getPetById(s.petId);
      return {
        label: `${service?.name} (${pet?.name})`,
        amount: s.price,
      };
    }),
    ...(appointment.depositPaid > 0
      ? [{ label: "Deposit Paid", amount: -appointment.depositPaid, isDiscount: true }]
      : []),
    { label: "Total Due", amount: appointment.totalPrice - appointment.depositPaid, isTotal: true },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Appointment Details</SheetTitle>
            <StatusBadge status={appointment.status} />
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Time */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">
                {format(new Date(appointment.startTime), "EEEE, MMMM d, yyyy")}
              </p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(appointment.startTime), "h:mm a")} -{" "}
                {format(new Date(appointment.endTime), "h:mm a")}
              </p>
            </div>
          </div>

          <Separator />

          {/* Client */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              Client
            </h4>
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                <User className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium">
                  {client?.firstName} {client?.lastName}
                </p>
                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                  <a href={`tel:${client?.phone}`} className="flex items-center gap-1 hover:text-foreground">
                    <Phone className="h-3 w-3" />
                    {client?.phone}
                  </a>
                  <a href={`mailto:${client?.email}`} className="flex items-center gap-1 hover:text-foreground">
                    <Mail className="h-3 w-3" />
                    Email
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          {appointment.isMobile && appointment.address && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3">
                Location
              </h4>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium">{appointment.address.street}</p>
                  <p className="text-sm text-muted-foreground">
                    {appointment.address.city}, {appointment.address.state}{" "}
                    {appointment.address.zip}
                  </p>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Pets */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              Pets
            </h4>
            <div className="space-y-3">
              {pets.map((pet) => {
                if (!pet) return null;
                const service = appointment.services.find(
                  (s) => s.petId === pet.id
                );
                const svc = service ? getServiceById(service.serviceId) : null;

                return (
                  <div
                    key={pet.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <PetAvatar
                      name={pet.name}
                      species={pet.species}
                      hasSafetyFlags={pet.safetyFlags.length > 0}
                    />
                    <div className="flex-1">
                      <p className="font-medium">{pet.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {pet.breed} &bull; {svc?.name}
                      </p>
                    </div>
                    {pet.safetyFlags.length > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        Safety Flags
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Groomer */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              Groomer
            </h4>
            <div className="flex items-center gap-3">
              <div
                className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-medium"
                style={{ backgroundColor: groomer?.color }}
              >
                {groomer?.firstName[0]}
                {groomer?.lastName[0]}
              </div>
              <div>
                <p className="font-medium">
                  {groomer?.firstName} {groomer?.lastName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {groomer?.specialties.slice(0, 2).join(", ")}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Pricing */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              Pricing
            </h4>
            <PriceSummary items={priceItems} />
          </div>

          {/* Notes */}
          {appointment.notes && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                Notes
              </h4>
              <p className="text-sm">{appointment.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button className="flex-1">Check In</Button>
            <Button variant="outline" className="flex-1">
              Edit
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
