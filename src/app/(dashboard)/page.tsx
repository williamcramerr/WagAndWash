"use client";

import * as React from "react";
import { PageHeader, SectionHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard, StatCardGrid } from "@/components/data-display/stat-card";
import { StatusBadge, StatusDot } from "@/components/ui/status-badge";
import { PetAvatar, PetAvatarGroup } from "@/components/ui/pet-avatar";
import { PriceDisplay } from "@/components/ui/price-display";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Plus,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import {
  getDashboardStats,
  getTodaysAppointments,
  getUpcomingAppointments,
  getRecentActivity,
  getReminders,
  getClientById,
  getPetById,
  getGroomerById,
} from "@/lib/mock-data";
import Link from "next/link";

export default function DashboardPage() {
  const stats = getDashboardStats();
  const todaysAppointments = getTodaysAppointments();
  const upcomingAppointments = getUpcomingAppointments(5);
  const recentActivity = getRecentActivity(5);
  const reminders = getReminders();

  // Get current time for greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${greeting}!`}
        description={`Here's what's happening at Wag & Wash today, ${format(new Date(), "EEEE, MMMM d")}`}
        actions={
          <Button asChild>
            <Link href="/appointments/new">
              <Plus className="h-4 w-4 mr-2" />
              New Appointment
            </Link>
          </Button>
        }
      />

      {/* Stats Grid */}
      <StatCardGrid columns={4}>
        <StatCard
          title="Today's Appointments"
          value={`${stats.completedToday}/${stats.todayAppointments}`}
          icon={Calendar}
          description="completed"
          trend={{ value: 12, label: "vs last week" }}
        />
        <StatCard
          title="Today's Revenue"
          value={stats.todayRevenue}
          format="currency"
          icon={DollarSign}
          trend={{ value: 8 }}
        />
        <StatCard
          title="Week Revenue"
          value={stats.weekRevenue}
          format="currency"
          icon={TrendingUp}
          trend={{ value: 15, label: "vs last week" }}
        />
        <StatCard
          title="New Clients"
          value={stats.newClientsThisMonth}
          icon={Users}
          description="this month"
          trend={{ value: 23 }}
        />
      </StatCardGrid>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column - Today's Schedule */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Schedule */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold">
                Today&apos;s Schedule
              </CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/calendar">
                  View Calendar
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todaysAppointments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No appointments scheduled for today
                  </p>
                ) : (
                  todaysAppointments.slice(0, 5).map((appointment) => {
                    const client = getClientById(appointment.clientId);
                    const groomer = getGroomerById(appointment.groomerId);
                    const pets = appointment.services.map((s) =>
                      getPetById(s.petId)
                    );

                    return (
                      <div
                        key={appointment.id}
                        className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
                      >
                        <div className="flex flex-col items-center text-center min-w-[60px]">
                          <span className="text-sm font-semibold">
                            {format(new Date(appointment.startTime), "h:mm")}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(appointment.startTime), "a")}
                          </span>
                        </div>

                        <div className="h-12 w-px bg-border" />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium truncate">
                              {client?.firstName} {client?.lastName}
                            </span>
                            <StatusBadge
                              status={appointment.status}
                              size="sm"
                            />
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <PetAvatarGroup
                              pets={pets.filter(Boolean).map((p) => ({
                                id: p!.id,
                                name: p!.name,
                                species: p!.species,
                                hasSafetyFlags: p!.safetyFlags.length > 0,
                              }))}
                              size="sm"
                            />
                            <span>
                              {pets
                                .filter(Boolean)
                                .map((p) => p!.name)
                                .join(", ")}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <PriceDisplay amount={appointment.totalPrice} />
                          <p className="text-xs text-muted-foreground">
                            with {groomer?.firstName}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold">
                Upcoming This Week
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/appointments">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingAppointments.map((appointment) => {
                  const client = getClientById(appointment.clientId);
                  const pet = getPetById(appointment.services[0]?.petId);

                  return (
                    <div
                      key={appointment.id}
                      className="flex items-center gap-3 p-3 rounded-md hover:bg-muted/50 transition-colors"
                    >
                      {pet && (
                        <PetAvatar
                          name={pet.name}
                          species={pet.species}
                          hasSafetyFlags={pet.safetyFlags.length > 0}
                          size="sm"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {pet?.name} ({client?.lastName})
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(
                            new Date(appointment.startTime),
                            "EEE, MMM d 'at' h:mm a"
                          )}
                        </p>
                      </div>
                      <StatusDot status={appointment.status} />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Reminders */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Reminders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[220px]">
                <div className="space-y-3">
                  {reminders.map((reminder) => (
                    <div
                      key={reminder.id}
                      className="flex items-start gap-3 p-3 rounded-md bg-muted/50"
                    >
                      <div
                        className={`h-2 w-2 rounded-full mt-1.5 ${
                          reminder.priority === "high"
                            ? "bg-destructive"
                            : reminder.priority === "medium"
                            ? "bg-warning"
                            : "bg-muted-foreground"
                        }`}
                      />
                      <div>
                        <p className="text-sm font-medium">{reminder.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {reminder.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[280px]">
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3"
                    >
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                          activity.type === "completion"
                            ? "bg-success/10 text-success"
                            : activity.type === "payment"
                            ? "bg-primary/10 text-primary"
                            : activity.type === "booking"
                            ? "bg-accent/10 text-accent"
                            : activity.type === "cancellation"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {activity.type === "completion" && (
                          <CheckCircle2 className="h-4 w-4" />
                        )}
                        {activity.type === "payment" && (
                          <DollarSign className="h-4 w-4" />
                        )}
                        {activity.type === "booking" && (
                          <Calendar className="h-4 w-4" />
                        )}
                        {activity.type === "cancellation" && (
                          <AlertTriangle className="h-4 w-4" />
                        )}
                        {activity.type === "check_in" && (
                          <Clock className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(activity.timestamp), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Utilization Rate
                </span>
                <span className="text-sm font-semibold">
                  {stats.utilizationRate}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${stats.utilizationRate}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Rebooking Rate
                </span>
                <span className="text-sm font-semibold">
                  {stats.rebookingRate}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-success rounded-full transition-all"
                  style={{ width: `${stats.rebookingRate}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
