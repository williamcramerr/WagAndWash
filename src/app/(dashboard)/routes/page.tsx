"use client";

import * as React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/ui/status-badge";
import { PetAvatar } from "@/components/ui/pet-avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, formatDate, formatTime, calculateAge } from "@/lib/utils";
import {
  MapPin,
  Navigation,
  Phone,
  Clock,
  ChevronRight,
  Route,
  Car,
  CheckCircle2,
  Circle,
  Play,
  AlertTriangle,
  Calendar,
  User,
} from "lucide-react";
import Link from "next/link";
import { format, addDays, isSameDay } from "date-fns";
import {
  getMobileAppointments,
  getClientById,
  getPetById,
  getGroomerById,
  getServiceById,
  getActiveGroomers,
  type Appointment,
} from "@/lib/mock-data";

export default function RoutesPage() {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [selectedGroomer, setSelectedGroomer] = React.useState<string>("all");

  const groomers = getActiveGroomers().filter((g) => g.isMobile);
  const mobileAppointments = getMobileAppointments();

  const filteredAppointments = React.useMemo(() => {
    let result = mobileAppointments.filter((apt) =>
      isSameDay(new Date(apt.startTime), selectedDate)
    );

    if (selectedGroomer !== "all") {
      result = result.filter((apt) => apt.groomerId === selectedGroomer);
    }

    return result.sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
  }, [mobileAppointments, selectedDate, selectedGroomer]);

  // Generate date options for the next 7 days
  const dateOptions = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  // Calculate route stats
  const totalStops = filteredAppointments.length;
  const completedStops = filteredAppointments.filter(
    (apt) => apt.status === "completed"
  ).length;
  const estimatedMiles = totalStops * 12; // Mock estimate
  const estimatedHours = totalStops * 1.5; // Mock estimate

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mobile Routes"
        description="Plan and manage mobile grooming routes"
        actions={
          <Button>
            <Route className="h-4 w-4 mr-2" />
            Optimize Route
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">{totalStops}</div>
                <p className="text-xs text-muted-foreground">Stops Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">
                  {completedStops}/{totalStops}
                </div>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Car className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-2xl font-bold">~{estimatedMiles}</div>
                <p className="text-xs text-muted-foreground">Est. Miles</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-2xl font-bold">~{estimatedHours}h</div>
                <p className="text-xs text-muted-foreground">Est. Duration</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select
          value={format(selectedDate, "yyyy-MM-dd")}
          onValueChange={(v) => setSelectedDate(new Date(v))}
        >
          <SelectTrigger className="w-[200px]">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {dateOptions.map((date) => (
              <SelectItem key={date.toISOString()} value={format(date, "yyyy-MM-dd")}>
                {isSameDay(date, new Date())
                  ? "Today"
                  : format(date, "EEE, MMM d")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedGroomer} onValueChange={setSelectedGroomer}>
          <SelectTrigger className="w-[200px]">
            <User className="h-4 w-4 mr-2" />
            <SelectValue placeholder="All Mobile Groomers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Mobile Groomers</SelectItem>
            {groomers.map((groomer) => (
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
      </div>

      {/* Route List & Map Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stop List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            Route for {isSameDay(selectedDate, new Date()) ? "Today" : format(selectedDate, "EEEE, MMMM d")}
          </h3>
          {filteredAppointments.length > 0 ? (
            <div className="space-y-3">
              {filteredAppointments.map((appointment, index) => (
                <RouteStop
                  key={appointment.id}
                  appointment={appointment}
                  stopNumber={index + 1}
                  isActive={index === completedStops}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MapPin className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No mobile appointments for this day</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Map Placeholder */}
        <Card className="h-[600px] overflow-hidden">
          <div className="h-full bg-muted/30 flex flex-col items-center justify-center">
            <Navigation className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground mb-2">Map View</p>
            <p className="text-sm text-muted-foreground text-center max-w-xs">
              Interactive route map with stop markers and turn-by-turn navigation coming soon
            </p>
            <Button variant="outline" className="mt-6">
              <Navigation className="h-4 w-4 mr-2" />
              Open in Maps
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

interface RouteStopProps {
  appointment: Appointment;
  stopNumber: number;
  isActive?: boolean;
}

function RouteStop({ appointment, stopNumber, isActive }: RouteStopProps) {
  const client = getClientById(appointment.clientId);
  const groomer = getGroomerById(appointment.groomerId);
  const pets = appointment.services.map((s) => getPetById(s.petId)).filter(Boolean);
  const services = appointment.services
    .map((s) => getServiceById(s.serviceId)?.name)
    .filter(Boolean);
  const hasSafetyFlags = pets.some((p) => p && p.safetyFlags.length > 0);

  const isCompleted = appointment.status === "completed";
  const isInProgress = appointment.status === "in_progress" || appointment.status === "checked_in";

  return (
    <Card
      className={cn(
        "transition-all",
        isActive && "ring-2 ring-primary shadow-md",
        isCompleted && "opacity-60"
      )}
    >
      <CardContent className="py-4">
        <div className="flex gap-4">
          {/* Stop Number */}
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center font-bold",
                isCompleted
                  ? "bg-green-100 text-green-600"
                  : isInProgress
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {isCompleted ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : isInProgress ? (
                <Play className="h-4 w-4" />
              ) : (
                stopNumber
              )}
            </div>
            {stopNumber < 10 && <div className="w-0.5 h-8 bg-border mt-2" />}
          </div>

          {/* Content */}
          <div className="flex-1">
            {/* Time & Status */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">
                  {formatTime(appointment.startTime)}
                </span>
                <span className="text-muted-foreground">-</span>
                <span className="text-muted-foreground">
                  {formatTime(appointment.endTime)}
                </span>
              </div>
              <StatusBadge status={appointment.status} />
            </div>

            {/* Client & Address */}
            <div className="mb-3">
              <p className="font-medium">
                {client?.firstName} {client?.lastName}
              </p>
              {appointment.address && (
                <p className="text-sm text-muted-foreground">
                  {appointment.address.street}, {appointment.address.city}
                </p>
              )}
            </div>

            {/* Pets & Services */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex -space-x-2">
                {pets.slice(0, 2).map((pet) =>
                  pet ? (
                    <PetAvatar
                      key={pet.id}
                      name={pet.name}
                      species={pet.species}
                      hasSafetyFlags={pet.safetyFlags.length > 0}
                      size="sm"
                      className="ring-2 ring-background"
                    />
                  ) : null
                )}
              </div>
              <div>
                <p className="text-sm font-medium">
                  {pets.map((p) => p?.name).join(", ")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {services.join(", ")}
                </p>
              </div>
              {hasSafetyFlags && (
                <AlertTriangle className="h-4 w-4 text-destructive ml-auto" />
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {!isCompleted && (
                <>
                  <Button size="sm" variant="outline" asChild>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(
                        `${appointment.address?.street}, ${appointment.address?.city}, ${appointment.address?.state}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Navigation className="h-4 w-4 mr-1" />
                      Navigate
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <a href={`tel:${client?.phone}`}>
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </a>
                  </Button>
                  {isActive && (
                    <Button size="sm" className="ml-auto">
                      Check In
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
