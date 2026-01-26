"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, formatCurrency } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Clock,
  Phone,
  Navigation,
  CheckCircle,
  Circle,
  Play,
  MoreHorizontal,
  Car,
  Dog,
  DollarSign,
  Calendar,
  Timer,
  AlertTriangle,
  Mail,
} from "lucide-react";
import { format, parse, addDays, subDays, isToday, isFuture, isPast } from "date-fns";
import { getClientById, getPetById, getServiceById } from "@/lib/mock-data";

interface RouteStop {
  id: string;
  order: number;
  appointmentId: string;
  clientId: string;
  petIds: string[];
  serviceIds: string[];
  scheduledTime: string;
  estimatedDuration: number;
  estimatedArrival: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  status: "pending" | "en_route" | "arrived" | "in_progress" | "completed" | "skipped";
  notes?: string;
  travelTimeFromPrevious: number; // minutes
  distanceFromPrevious: number; // miles
}

// Mock route data
const mockRoute: RouteStop[] = [
  {
    id: "stop_1",
    order: 1,
    appointmentId: "apt_1",
    clientId: "cli_1",
    petIds: ["pet_1"],
    serviceIds: ["svc_1"],
    scheduledTime: "08:00",
    estimatedDuration: 90,
    estimatedArrival: "08:00",
    address: { street: "123 Oak Street", city: "Springfield", state: "CA", zip: "90210" },
    status: "completed",
    travelTimeFromPrevious: 15,
    distanceFromPrevious: 5.2,
  },
  {
    id: "stop_2",
    order: 2,
    appointmentId: "apt_2",
    clientId: "cli_2",
    petIds: ["pet_3"],
    serviceIds: ["svc_2"],
    scheduledTime: "10:00",
    estimatedDuration: 60,
    estimatedArrival: "09:50",
    address: { street: "456 Elm Avenue", city: "Springfield", state: "CA", zip: "90211" },
    status: "in_progress",
    notes: "Gate code: 1234",
    travelTimeFromPrevious: 12,
    distanceFromPrevious: 4.1,
  },
  {
    id: "stop_3",
    order: 3,
    appointmentId: "apt_3",
    clientId: "cli_3",
    petIds: ["pet_5", "pet_6"],
    serviceIds: ["svc_1", "svc_3"],
    scheduledTime: "12:00",
    estimatedDuration: 120,
    estimatedArrival: "11:45",
    address: { street: "789 Pine Road", city: "Shelbyville", state: "CA", zip: "90212" },
    status: "pending",
    travelTimeFromPrevious: 18,
    distanceFromPrevious: 7.3,
  },
  {
    id: "stop_4",
    order: 4,
    appointmentId: "apt_4",
    clientId: "cli_5",
    petIds: ["pet_8"],
    serviceIds: ["svc_1"],
    scheduledTime: "14:30",
    estimatedDuration: 75,
    estimatedArrival: "14:20",
    address: { street: "321 Maple Drive", city: "Capital City", state: "CA", zip: "90213" },
    status: "pending",
    travelTimeFromPrevious: 22,
    distanceFromPrevious: 9.8,
  },
  {
    id: "stop_5",
    order: 5,
    appointmentId: "apt_5",
    clientId: "cli_8",
    petIds: ["pet_10"],
    serviceIds: ["svc_2"],
    scheduledTime: "16:30",
    estimatedDuration: 60,
    estimatedArrival: "16:15",
    address: { street: "654 Cedar Lane", city: "Springfield", state: "CA", zip: "90210" },
    status: "pending",
    travelTimeFromPrevious: 25,
    distanceFromPrevious: 11.2,
  },
];

const statusConfig = {
  pending: { label: "Pending", color: "bg-gray-100 text-gray-700", icon: Circle },
  en_route: { label: "En Route", color: "bg-blue-100 text-blue-700", icon: Car },
  arrived: { label: "Arrived", color: "bg-amber-100 text-amber-700", icon: MapPin },
  in_progress: { label: "In Progress", color: "bg-purple-100 text-purple-700", icon: Play },
  completed: { label: "Completed", color: "bg-green-100 text-green-700", icon: CheckCircle },
  skipped: { label: "Skipped", color: "bg-red-100 text-red-700", icon: AlertTriangle },
};

export default function RouteDayPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const dateParam = params.date as string;
  const routeDate = parse(dateParam, "yyyy-MM-dd", new Date());

  const [stops, setStops] = React.useState(mockRoute);

  const completedStops = stops.filter((s) => s.status === "completed").length;
  const totalStops = stops.length;
  const progress = (completedStops / totalStops) * 100;

  const totalMiles = stops.reduce((sum, stop) => sum + stop.distanceFromPrevious, 0);
  const totalDriveTime = stops.reduce((sum, stop) => sum + stop.travelTimeFromPrevious, 0);
  const totalServiceTime = stops.reduce((sum, stop) => sum + stop.estimatedDuration, 0);

  const currentStop = stops.find(
    (s) => s.status === "in_progress" || s.status === "en_route" || s.status === "arrived"
  );
  const nextStop = stops.find((s) => s.status === "pending");

  const handleStatusChange = (stopId: string, newStatus: RouteStop["status"]) => {
    setStops((prev) =>
      prev.map((stop) => (stop.id === stopId ? { ...stop, status: newStatus } : stop))
    );

    const statusLabels: Record<RouteStop["status"], string> = {
      pending: "Status reset to pending",
      en_route: "Marked as en route",
      arrived: "Marked as arrived",
      in_progress: "Started appointment",
      completed: "Appointment completed",
      skipped: "Stop skipped",
    };

    toast({
      title: statusLabels[newStatus] || "Status updated",
    });
  };

  const navigateTo = (address: RouteStop["address"]) => {
    const query = encodeURIComponent(
      `${address.street}, ${address.city}, ${address.state} ${address.zip}`
    );
    window.open(`https://maps.google.com/?q=${query}`, "_blank");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Route for ${format(routeDate, "EEEE, MMMM d")}`}
        description={`${totalStops} stops • ${totalMiles.toFixed(1)} miles • ${Math.floor(totalDriveTime / 60)}h ${totalDriveTime % 60}m drive time`}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                router.push(`/routes/${format(subDays(routeDate, 1), "yyyy-MM-dd")}`)
              }
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" asChild>
              <Link href="/routes">All Routes</Link>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                router.push(`/routes/${format(addDays(routeDate, 1), "yyyy-MM-dd")}`)
              }
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        }
      />

      {/* Progress Overview */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Today&apos;s Progress</p>
              <p className="text-2xl font-bold">
                {completedStops} of {totalStops} stops
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Estimated Earnings</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(485)}</p>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Current/Next Stop Highlight */}
      {(currentStop || nextStop) && (
        <Card className="border-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {currentStop ? "Current Stop" : "Next Stop"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const stop = currentStop || nextStop;
              if (!stop) return null;
              const client = getClientById(stop.clientId);
              const pets = stop.petIds.map((id) => getPetById(id)).filter(Boolean);
              const config = statusConfig[stop.status];
              const StatusIcon = config.icon;

              return (
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {client?.firstName[0]}
                          {client?.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {client?.firstName} {client?.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {pets.map((p) => p?.name).join(", ")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {stop.scheduledTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Timer className="h-4 w-4" />
                        {stop.estimatedDuration} min
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span>
                        {stop.address.street}, {stop.address.city}
                      </span>
                    </div>
                    {stop.notes && (
                      <p className="text-sm text-amber-600 mt-2 flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4" />
                        {stop.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button onClick={() => navigateTo(stop.address)}>
                      <Navigation className="h-4 w-4 mr-2" />
                      Navigate
                    </Button>
                    {stop.status === "pending" && (
                      <Button
                        variant="outline"
                        onClick={() => handleStatusChange(stop.id, "en_route")}
                      >
                        <Car className="h-4 w-4 mr-2" />
                        Start Route
                      </Button>
                    )}
                    {stop.status === "en_route" && (
                      <Button
                        variant="outline"
                        onClick={() => handleStatusChange(stop.id, "arrived")}
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        Arrived
                      </Button>
                    )}
                    {stop.status === "arrived" && (
                      <Button
                        variant="outline"
                        onClick={() => handleStatusChange(stop.id, "in_progress")}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start
                      </Button>
                    )}
                    {stop.status === "in_progress" && (
                      <Button
                        variant="outline"
                        onClick={() => handleStatusChange(stop.id, "completed")}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Complete
                      </Button>
                    )}
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}

      {/* All Stops */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">All Stops</h2>
        {stops.map((stop, index) => {
          const client = getClientById(stop.clientId);
          const pets = stop.petIds.map((id) => getPetById(id)).filter(Boolean);
          const services = stop.serviceIds.map((id) => getServiceById(id)).filter(Boolean);
          const config = statusConfig[stop.status];
          const StatusIcon = config.icon;

          return (
            <Card
              key={stop.id}
              className={cn(
                stop.status === "in_progress" && "border-primary shadow-md",
                stop.status === "completed" && "opacity-60"
              )}
            >
              <CardContent className="py-4">
                <div className="flex items-start gap-4">
                  {/* Order Number */}
                  <div
                    className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0",
                      stop.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : stop.status === "in_progress"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {stop.status === "completed" ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      stop.order
                    )}
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">
                            {client?.firstName} {client?.lastName}
                          </p>
                          <Badge className={config.color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {config.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {pets.map((p) => p?.name).join(", ")} •{" "}
                          {services.map((s) => s?.name).join(", ")}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigateTo(stop.address)}>
                            <Navigation className="h-4 w-4 mr-2" />
                            Navigate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="h-4 w-4 mr-2" />
                            Call Client
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleStatusChange(stop.id, "skipped")}
                          >
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Skip Stop
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {stop.scheduledTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Timer className="h-4 w-4" />
                        {stop.estimatedDuration} min
                      </span>
                      {index > 0 && (
                        <span className="flex items-center gap-1">
                          <Car className="h-4 w-4" />
                          {stop.distanceFromPrevious} mi ({stop.travelTimeFromPrevious} min)
                        </span>
                      )}
                    </div>

                    <div className="flex items-start gap-2 mt-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">
                        {stop.address.street}, {stop.address.city}, {stop.address.state}{" "}
                        {stop.address.zip}
                      </span>
                    </div>

                    {stop.notes && (
                      <p className="text-sm text-amber-600 mt-2 flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4" />
                        {stop.notes}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Route Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Route Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <Car className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
              <p className="text-2xl font-bold">{totalMiles.toFixed(1)}</p>
              <p className="text-sm text-muted-foreground">Total Miles</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Timer className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
              <p className="text-2xl font-bold">
                {Math.floor(totalDriveTime / 60)}h {totalDriveTime % 60}m
              </p>
              <p className="text-sm text-muted-foreground">Drive Time</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Dog className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
              <p className="text-2xl font-bold">
                {Math.floor(totalServiceTime / 60)}h {totalServiceTime % 60}m
              </p>
              <p className="text-sm text-muted-foreground">Service Time</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <DollarSign className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
              <p className="text-2xl font-bold text-green-600">{formatCurrency(485)}</p>
              <p className="text-sm text-muted-foreground">Est. Earnings</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
