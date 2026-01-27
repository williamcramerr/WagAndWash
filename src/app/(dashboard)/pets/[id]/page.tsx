"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
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
import { cn, formatCurrency, formatDate, formatTime, calculateAge } from "@/lib/utils";
import {
  ArrowLeft,
  Edit,
  MoreHorizontal,
  AlertTriangle,
  Calendar,
  Clock,
  User,
  Scissors,
  Heart,
  Camera,
  FileText,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Shield,
  Star,
  Phone,
  Mail,
} from "lucide-react";
import Link from "next/link";
import {
  getPetById,
  getClientById,
  getAppointmentsByPetId,
  getGroomerById,
  getServiceById,
  groomers,
  type Pet,
  type Appointment,
} from "@/lib/mock-data";

export default function PetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const petId = params.id as string;

  const pet = getPetById(petId);
  const client = pet ? getClientById(pet.clientId) : null;
  const appointments = pet ? getAppointmentsByPetId(petId) : [];

  if (!pet || !client) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px]">
        <p className="text-muted-foreground">Pet not found</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  const hasSafetyFlags = pet.safetyFlags.length > 0;
  const preferredGroomer = pet.preferredGroomerId
    ? groomers.find((g) => g.id === pet.preferredGroomerId)
    : null;

  const pastAppointments = appointments
    .filter((apt) => new Date(apt.startTime) <= new Date() && apt.status === "completed")
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

  const upcomingAppointments = appointments.filter(
    (apt) => new Date(apt.startTime) > new Date() && apt.status !== "canceled"
  );

  // Calculate vaccination status
  const getVaccinationStatus = (expirationDate: string | undefined) => {
    if (!expirationDate) return "missing";
    const expiry = new Date(expirationDate);
    const now = new Date();
    const daysUntilExpiry = Math.floor(
      (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysUntilExpiry < 0) return "expired";
    if (daysUntilExpiry < 30) return "expiring";
    return "valid";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <PetAvatar
            name={pet.name}
            species={pet.species}
            hasSafetyFlags={hasSafetyFlags}
            size="xl"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{pet.name}</h1>
              {hasSafetyFlags && (
                <AlertTriangle className="h-5 w-5 text-destructive" />
              )}
            </div>
            <p className="text-muted-foreground">
              {pet.breed} &bull; {pet.gender} &bull; {calculateAge(pet.dateOfBirth)} &bull; {pet.weight} lbs
            </p>
            <div className="flex items-center gap-4 mt-2">
              <Link
                href={`/clients/${client.id}`}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <User className="h-4 w-4" />
                {client.firstName} {client.lastName}
              </Link>
              <a
                href={`tel:${client.phone}`}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <Phone className="h-4 w-4" />
                {client.phone}
              </a>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href={`/appointments/new?pet=${pet.id}`}>
              <Calendar className="h-4 w-4 mr-2" />
              Book Appointment
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/pets/${pet.id}/edit`}>
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
                <Camera className="h-4 w-4 mr-2" />
                Add Photo
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="h-4 w-4 mr-2" />
                Add Note
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Archive Pet
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Safety Alerts */}
      {hasSafetyFlags && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Shield className="h-5 w-5" />
              Safety Alerts
            </CardTitle>
            <CardDescription>
              Review these flags before each appointment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pet.safetyFlags.map((flag, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg",
                    flag.severity === "high"
                      ? "bg-red-100 dark:bg-red-900/20"
                      : flag.severity === "medium"
                      ? "bg-yellow-100 dark:bg-yellow-900/20"
                      : "bg-blue-100 dark:bg-blue-900/20"
                  )}
                >
                  <div
                    className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                      flag.severity === "high"
                        ? "bg-red-500 text-white"
                        : flag.severity === "medium"
                        ? "bg-yellow-500 text-white"
                        : "bg-blue-500 text-white"
                    )}
                  >
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{flag.type}</span>
                      <Badge
                        variant={
                          flag.severity === "high"
                            ? "destructive"
                            : flag.severity === "medium"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {flag.severity}
                      </Badge>
                    </div>
                    <p className="text-sm mt-1">{flag.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">Grooming History</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Grooming Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scissors className="h-5 w-5" />
                  Grooming Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Preferred Groomer</span>
                  <span className="font-medium">
                    {preferredGroomer
                      ? `${preferredGroomer.firstName} ${preferredGroomer.lastName}`
                      : "No preference"}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Coat Type</span>
                  <span className="font-medium">{pet.coatType}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Size Category</span>
                  <span className="font-medium capitalize">{pet.size}</span>
                </div>
                {pet.groomingNotes && (
                  <>
                    <Separator />
                    <div>
                      <span className="text-muted-foreground">Grooming Notes</span>
                      <p className="mt-1 text-sm">{pet.groomingNotes}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Last Grooming Report */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Last Grooming Report
                </CardTitle>
                {pet.lastGroomDate && (
                  <CardDescription>{formatDate(pet.lastGroomDate)}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {pastAppointments.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Coat Condition
                        </span>
                        <div className="flex items-center gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-4 w-4",
                                i <= 4
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-muted-foreground"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Behavior
                        </span>
                        <div className="flex items-center gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-4 w-4",
                                i <= 5
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-muted-foreground"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <span className="text-sm text-muted-foreground">Notes</span>
                      <p className="mt-1 text-sm">
                        Coat in good condition with minor matting behind ears.
                        Recommend booking every 6 weeks for optimal coat health.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary">No skin issues</Badge>
                      <Badge variant="secondary">Well-behaved</Badge>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6">
                    <Scissors className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">No grooming history yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Appointments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Upcoming Appointments</CardTitle>
              <Button size="sm" asChild>
                <Link href={`/appointments/new?pet=${pet.id}`}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Book
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-3">
                  {upcomingAppointments.map((apt) => {
                    const groomer = getGroomerById(apt.groomerId);
                    const services = apt.services
                      .map((s) => getServiceById(s.serviceId)?.name)
                      .filter(Boolean);
                    return (
                      <Link
                        key={apt.id}
                        href={`/appointments/${apt.id}`}
                        className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="text-lg font-bold">
                              {formatTime(apt.startTime)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatDate(apt.startTime)}
                            </div>
                          </div>
                          <Separator orientation="vertical" className="h-10" />
                          <div>
                            <div className="font-medium">{services.join(", ")}</div>
                            <div className="text-sm text-muted-foreground">
                              with {groomer?.firstName} {groomer?.lastName}
                            </div>
                          </div>
                        </div>
                        <StatusBadge status={apt.status} />
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No upcoming appointments</p>
                  <Button variant="outline" className="mt-4" asChild>
                    <Link href={`/appointments/new?pet=${pet.id}`}>Book Now</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Grooming History</CardTitle>
              <CardDescription>
                {pastAppointments.length} completed appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pastAppointments.length > 0 ? (
                <div className="space-y-4">
                  {pastAppointments.map((apt) => {
                    const groomer = getGroomerById(apt.groomerId);
                    const services = apt.services
                      .map((s) => getServiceById(s.serviceId)?.name)
                      .filter(Boolean);
                    return (
                      <Link
                        key={apt.id}
                        href={`/appointments/${apt.id}`}
                        className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-center min-w-[80px]">
                            <div className="font-medium">
                              {formatDate(apt.startTime)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatTime(apt.startTime)}
                            </div>
                          </div>
                          <Separator orientation="vertical" className="h-10" />
                          <div>
                            <div className="font-medium">{services.join(", ")}</div>
                            <div className="text-sm text-muted-foreground">
                              Groomer: {groomer?.firstName} {groomer?.lastName}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {formatCurrency(apt.totalPrice)}
                          </div>
                          <StatusBadge status={apt.status} />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No grooming history</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-6">
          {/* Vaccination Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Vaccination Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pet.vaccinations.map((vax, i) => {
                  const status = getVaccinationStatus(vax.expirationDate);
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        {status === "valid" ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : status === "expiring" ? (
                          <AlertCircle className="h-5 w-5 text-yellow-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <div>
                          <div className="font-medium">{vax.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {vax.expirationDate
                              ? `Expires: ${formatDate(vax.expirationDate)}`
                              : "No record"}
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant={
                          status === "valid"
                            ? "default"
                            : status === "expiring"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {status === "valid"
                          ? "Valid"
                          : status === "expiring"
                          ? "Expiring Soon"
                          : "Expired"}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Medical Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Medical Notes</CardTitle>
            </CardHeader>
            <CardContent>
              {pet.groomingNotes ? (
                <p className="whitespace-pre-wrap">{pet.groomingNotes}</p>
              ) : (
                <p className="text-muted-foreground">No medical notes</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="photos" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Photo Gallery</CardTitle>
              <Button size="sm">
                <Camera className="h-4 w-4 mr-2" />
                Add Photos
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12">
                <Camera className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground mb-4">No photos yet</p>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  Add before and after photos during grooming appointments to track
                  coat health and share with pet parents.
                </p>
                <Button variant="outline" className="mt-4">
                  <Camera className="h-4 w-4 mr-2" />
                  Upload First Photo
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
