"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  ArrowLeft,
  Edit,
  MoreHorizontal,
  Mail,
  Phone,
  Calendar,
  Clock,
  Star,
  Award,
  TrendingUp,
  Users,
  Scissors,
  MapPin,
  DollarSign,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
import {
  groomers,
  appointments,
  getClientById,
  getPetById,
  getServiceById,
  type Groomer,
} from "@/lib/mock-data";

export default function TeamMemberDetailPage() {
  const params = useParams();
  const router = useRouter();

  const groomer = groomers.find((g) => g.id === params.id);

  if (!groomer) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-semibold">Team member not found</h2>
        <p className="text-muted-foreground mt-2">This team member does not exist or has been removed.</p>
        <Button asChild className="mt-4">
          <Link href="/team">Back to Team</Link>
        </Button>
      </div>
    );
  }

  // Get groomer's appointments
  const groomerAppointments = appointments.filter((a) => a.groomerId === groomer.id);
  const completedAppointments = groomerAppointments.filter((a) => a.status === "completed");
  const thisMonthAppointments = groomerAppointments.filter((a) => {
    const date = new Date(a.startTime);
    const now = new Date();
    return date >= startOfMonth(now) && date <= endOfMonth(now);
  });

  // Calculate stats
  const totalRevenue = completedAppointments.reduce((sum, a) => sum + a.totalPrice, 0);
  const monthlyRevenue = thisMonthAppointments
    .filter((a) => a.status === "completed")
    .reduce((sum, a) => sum + a.totalPrice, 0);
  const avgAppointmentValue = completedAppointments.length > 0
    ? totalRevenue / completedAppointments.length
    : 0;
  const completionRate = groomerAppointments.length > 0
    ? (completedAppointments.length / groomerAppointments.length) * 100
    : 0;

  // Recent appointments
  const recentAppointments = groomerAppointments
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
    .slice(0, 10);

  // Schedule for display
  const scheduleOrder = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const scheduleDisplay = scheduleOrder.map((day) => ({
    day: day.charAt(0).toUpperCase() + day.slice(1),
    hours: groomer.schedule[day],
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team Member"
        description="View profile and performance"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/team">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Calendar className="h-4 w-4 mr-2" />
                  View Schedule
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  Deactivate
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      />

      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={groomer.imageUrl} />
              <AvatarFallback
                className="text-2xl text-white"
                style={{ backgroundColor: groomer.color }}
              >
                {groomer.firstName[0]}{groomer.lastName[0]}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    {groomer.firstName} {groomer.lastName}
                  </h2>
                  <div className="flex items-center gap-3 mt-1 text-muted-foreground">
                    <Badge variant={groomer.isActive ? "default" : "secondary"}>
                      {groomer.isActive ? "Active" : "Inactive"}
                    </Badge>
                    {groomer.isMobile && (
                      <Badge variant="outline">
                        <MapPin className="h-3 w-3 mr-1" />
                        Mobile
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
                <a href={`mailto:${groomer.email}`} className="flex items-center gap-1 hover:text-primary">
                  <Mail className="h-4 w-4" />
                  {groomer.email}
                </a>
                <a href={`tel:${groomer.phone}`} className="flex items-center gap-1 hover:text-primary">
                  <Phone className="h-4 w-4" />
                  {groomer.phone}
                </a>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Joined {format(new Date(groomer.hireDate), "MMMM yyyy")}
                </span>
              </div>

              {groomer.bio && (
                <p className="mt-4 text-muted-foreground">{groomer.bio}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{formatCurrency(monthlyRevenue)}</p>
                <p className="text-xs text-muted-foreground">This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Scissors className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{thisMonthAppointments.length}</p>
                <p className="text-xs text-muted-foreground">Appointments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{formatCurrency(avgAppointmentValue)}</p>
                <p className="text-xs text-muted-foreground">Avg Ticket</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{completionRate.toFixed(0)}%</p>
                <p className="text-xs text-muted-foreground">Completion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Specialties & Certifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Specialties & Certifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Specialties</p>
                  <div className="flex flex-wrap gap-2">
                    {groomer.specialties.map((specialty, i) => (
                      <Badge key={i} variant="secondary">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Certifications</p>
                  <div className="flex flex-wrap gap-2">
                    {groomer.certifications.map((cert, i) => (
                      <Badge key={i} variant="outline">
                        <Award className="h-3 w-3 mr-1" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Total Revenue</span>
                    <span className="font-medium">{formatCurrency(totalRevenue)}</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Appointments Completed</span>
                    <span className="font-medium">{completedAppointments.length}</span>
                  </div>
                  <Progress value={completionRate} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Client Satisfaction</span>
                    <span className="font-medium flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      4.9
                    </span>
                  </div>
                  <Progress value={98} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule</CardTitle>
              <CardDescription>Regular working hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scheduleDisplay.map(({ day, hours }) => (
                  <div
                    key={day}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <span className="font-medium w-28">{day}</span>
                    {hours ? (
                      <span className="text-muted-foreground">
                        {hours.start} - {hours.end}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Off</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Recent Appointments</CardTitle>
              <CardDescription>Last 10 appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAppointments.map((apt) => {
                  const client = getClientById(apt.clientId);
                  const pet = getPetById(apt.services[0]?.petId);
                  const service = getServiceById(apt.services[0]?.serviceId);

                  return (
                    <Link
                      key={apt.id}
                      href={`/appointments/${apt.id}`}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "h-10 w-10 rounded-lg flex items-center justify-center",
                          apt.status === "completed" ? "bg-green-100" :
                          apt.status === "canceled" ? "bg-red-100" :
                          "bg-muted"
                        )}>
                          {apt.status === "completed" ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : apt.status === "canceled" ? (
                            <XCircle className="h-5 w-5 text-red-600" />
                          ) : (
                            <Clock className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {client?.firstName} {client?.lastName} - {pet?.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {service?.name} • {format(new Date(apt.startTime), "MMM d, h:mm a")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(apt.totalPrice)}</p>
                        <Badge variant={
                          apt.status === "completed" ? "default" :
                          apt.status === "canceled" ? "destructive" :
                          "secondary"
                        } className="text-xs">
                          {apt.status}
                        </Badge>
                      </div>
                    </Link>
                  );
                })}
                {recentAppointments.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No appointments yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
