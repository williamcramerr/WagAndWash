"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/ui/status-badge";
import { PetAvatar } from "@/components/ui/pet-avatar";
import { PriceDisplay } from "@/components/ui/price-display";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, formatCurrency, formatDate, formatTime, getInitials, calculateAge } from "@/lib/utils";
import {
  ArrowLeft,
  Edit,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Plus,
  Star,
  AlertTriangle,
  Clock,
  CreditCard,
  FileText,
  Trash2,
  MessageSquare,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import {
  getClientById,
  getPetsByClientId,
  getAppointmentsByClientId,
  getPaymentsByClientId,
  getServiceById,
  getGroomerById,
  type Client,
  type Pet,
  type Appointment,
  type Payment,
} from "@/lib/mock-data";

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;

  const client = getClientById(clientId);
  const pets = getPetsByClientId(clientId);
  const appointments = getAppointmentsByClientId(clientId);
  const payments = getPaymentsByClientId(clientId);

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px]">
        <p className="text-muted-foreground">Client not found</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  const upcomingAppointments = appointments.filter(
    (apt) => new Date(apt.startTime) > new Date() && apt.status !== "canceled"
  );
  const pastAppointments = appointments
    .filter((apt) => new Date(apt.startTime) <= new Date() || apt.status === "canceled")
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

  // Compute last visit from completed appointments
  const completedAppointments = appointments.filter((apt) => apt.status === "completed");
  const lastVisit = completedAppointments.length > 0
    ? completedAppointments.sort(
        (a, b) => new Date(b.completedAt || b.startTime).getTime() - new Date(a.completedAt || a.startTime).getTime()
      )[0].completedAt || completedAppointments[0].startTime
    : null;

  return (
    <div className="space-y-6">
      {/* Header with client info */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-xl bg-primary/10 text-primary">
              {getInitials(`${client.firstName} ${client.lastName}`)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">
                {client.firstName} {client.lastName}
              </h1>
              {client.tags.includes("VIP") && (
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
              )}
              <Badge variant={client.isActive ? "default" : "secondary"}>
                {client.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
              <a
                href={`mailto:${client.email}`}
                className="flex items-center gap-1 hover:text-foreground"
              >
                <Mail className="h-4 w-4" />
                {client.email}
              </a>
              <a
                href={`tel:${client.phone}`}
                className="flex items-center gap-1 hover:text-foreground"
              >
                <Phone className="h-4 w-4" />
                {client.phone}
              </a>
            </div>
            <div className="flex items-center gap-3 mt-2">
              {client.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href={`/appointments/new?client=${client.id}`}>
              <Calendar className="h-4 w-4 mr-2" />
              Book Appointment
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/clients/${client.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageSquare className="h-4 w-4 mr-2" />
                Send SMS
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Plus className="h-4 w-4 mr-2" />
                Add Pet
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="h-4 w-4 mr-2" />
                Add Note
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Archive Client
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-2xl font-bold">{appointments.length}</div>
                <p className="text-xs text-muted-foreground">Total Visits</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-2xl font-bold">
                  {formatCurrency(client.totalSpent)}
                </div>
                <p className="text-xs text-muted-foreground">Lifetime Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-2xl font-bold">
                  {lastVisit ? formatDate(lastVisit) : "Never"}
                </div>
                <p className="text-xs text-muted-foreground">Last Visit</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-2xl font-bold">{pets.length}</div>
                <p className="text-xs text-muted-foreground">
                  {pets.length === 1 ? "Pet" : "Pets"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pets" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pets">
            Pets ({pets.length})
          </TabsTrigger>
          <TabsTrigger value="appointments">
            Appointments ({appointments.length})
          </TabsTrigger>
          <TabsTrigger value="payments">
            Payments ({payments.length})
          </TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="pets" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Pets</h3>
            <Button size="sm" asChild>
              <Link href={`/pets/new?client=${client.id}`}>
                <Plus className="h-4 w-4 mr-2" />
                Add Pet
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-6">
          {/* Upcoming */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Upcoming Appointments</h3>
              <Button size="sm" asChild>
                <Link href={`/appointments/new?client=${client.id}`}>
                  <Plus className="h-4 w-4 mr-2" />
                  Book Appointment
                </Link>
              </Button>
            </div>
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-3">
                {upcomingAppointments.map((apt) => (
                  <AppointmentRow key={apt.id} appointment={apt} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No upcoming appointments</p>
                  <Button variant="outline" className="mt-4" asChild>
                    <Link href={`/appointments/new?client=${client.id}`}>
                      Book Now
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Past */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Past Appointments</h3>
            {pastAppointments.length > 0 ? (
              <div className="space-y-3">
                {pastAppointments.slice(0, 10).map((apt) => (
                  <AppointmentRow key={apt.id} appointment={apt} />
                ))}
                {pastAppointments.length > 10 && (
                  <Button variant="outline" className="w-full">
                    View All ({pastAppointments.length} total)
                  </Button>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center py-8">
                  <p className="text-muted-foreground">No past appointments</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Payment History</h3>
            <div className="text-sm text-muted-foreground">
              Total: {formatCurrency(payments.reduce((sum, p) => sum + p.amount, 0))}
            </div>
          </div>
          {payments.length > 0 ? (
            <Card>
              <div className="divide-y">
                {payments.map((payment) => (
                  <PaymentRow key={payment.id} payment={payment} />
                ))}
              </div>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <p className="text-muted-foreground">No payment history</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Notes</h3>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Note
            </Button>
          </div>
          {client.notes ? (
            <Card>
              <CardContent className="pt-6">
                <p className="whitespace-pre-wrap">{client.notes}</p>
                <p className="text-xs text-muted-foreground mt-4">
                  Last updated: {formatDate(client.createdAt)}
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No notes yet</p>
                <Button variant="outline" className="mt-4">
                  Add First Note
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PetCard({ pet }: { pet: Pet }) {
  const hasSafetyFlags = pet.safetyFlags.length > 0;

  return (
    <Link href={`/pets/${pet.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <PetAvatar
              name={pet.name}
              species={pet.species}
              hasSafetyFlags={hasSafetyFlags}
              size="lg"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold truncate">{pet.name}</h4>
                {hasSafetyFlags && (
                  <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {pet.breed} &bull; {pet.gender}
              </p>
              <p className="text-sm text-muted-foreground">
                {pet.weight} lbs &bull; {calculateAge(pet.dateOfBirth)}
              </p>
            </div>
          </div>
          {hasSafetyFlags && (
            <div className="mt-4 p-2 rounded-md bg-destructive/10 border border-destructive/20">
              <p className="text-xs font-medium text-destructive mb-1">
                Safety Flags
              </p>
              <div className="flex flex-wrap gap-1">
                {pet.safetyFlags.map((flag, i) => (
                  <Badge key={i} variant="destructive" className="text-xs">
                    {flag.type}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

function AppointmentRow({ appointment }: { appointment: Appointment }) {
  const groomer = getGroomerById(appointment.groomerId);
  const serviceNames = appointment.services
    .map((s) => getServiceById(s.serviceId)?.name)
    .filter(Boolean)
    .join(", ");

  return (
    <Link href={`/appointments/${appointment.id}`}>
      <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-center min-w-[60px]">
                <div className="text-lg font-bold">
                  {formatTime(appointment.startTime)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDate(appointment.startTime)}
                </div>
              </div>
              <Separator orientation="vertical" className="h-12" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{serviceNames}</span>
                  <StatusBadge status={appointment.status} />
                </div>
                <p className="text-sm text-muted-foreground">
                  with {groomer?.firstName} {groomer?.lastName}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold">
                {formatCurrency(appointment.totalPrice)}
              </div>
              {appointment.isMobile && (
                <Badge variant="outline" className="text-xs">
                  <MapPin className="h-3 w-3 mr-1" />
                  Mobile
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function PaymentRow({ payment }: { payment: Payment }) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "h-10 w-10 rounded-full flex items-center justify-center",
            payment.status === "completed"
              ? "bg-green-100 text-green-600"
              : payment.status === "refunded"
              ? "bg-red-100 text-red-600"
              : "bg-yellow-100 text-yellow-600"
          )}
        >
          <CreditCard className="h-5 w-5" />
        </div>
        <div>
          <div className="font-medium">
            Payment
          </div>
          <div className="text-sm text-muted-foreground">
            {formatDate(payment.processedAt)} &bull;{" "}
            {payment.method.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-semibold">{formatCurrency(payment.amount)}</div>
        {payment.tip > 0 && (
          <div className="text-xs text-muted-foreground">
            +{formatCurrency(payment.tip)} tip
          </div>
        )}
      </div>
    </div>
  );
}
