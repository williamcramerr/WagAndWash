"use client";

import * as React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { cn, formatCurrency } from "@/lib/utils";
import {
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  Star,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Repeat,
  UserPlus,
} from "lucide-react";
import {
  getDashboardStats,
  clients,
  appointments,
  payments,
  getActiveGroomers,
  services,
} from "@/lib/mock-data";
import { subDays, format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";

type TimeRange = "week" | "month" | "quarter" | "year";

export default function ReportsPage() {
  const [timeRange, setTimeRange] = React.useState<TimeRange>("month");
  const stats = getDashboardStats();
  const groomers = getActiveGroomers();

  // Calculate service popularity
  const servicePopularity = React.useMemo(() => {
    const counts: Record<string, number> = {};
    appointments.forEach((apt) => {
      apt.services.forEach((svc) => {
        counts[svc.serviceId] = (counts[svc.serviceId] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .map(([id, count]) => ({
        service: services.find((s) => s.id === id),
        count,
      }))
      .filter((s) => s.service)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, []);

  // Calculate groomer stats
  const groomerStats = React.useMemo(() => {
    return groomers.map((groomer) => {
      const groomerAppts = appointments.filter(
        (apt) => apt.groomerId === groomer.id && apt.status === "completed"
      );
      const revenue = groomerAppts.reduce((sum, apt) => sum + apt.totalPrice, 0);
      return {
        groomer,
        appointments: groomerAppts.length,
        revenue,
      };
    }).sort((a, b) => b.revenue - a.revenue);
  }, [groomers]);

  // Mock daily revenue for chart
  const dailyRevenue = React.useMemo(() => {
    const days = eachDayOfInterval({
      start: subDays(new Date(), 30),
      end: new Date(),
    });
    return days.map((day) => ({
      date: format(day, "MMM d"),
      revenue: Math.floor(Math.random() * 1500) + 500,
    }));
  }, []);

  const totalMonthRevenue = dailyRevenue.reduce((sum, d) => sum + d.revenue, 0);
  const maxDayRevenue = Math.max(...dailyRevenue.map((d) => d.revenue));

  // Client growth
  const newClientsThisMonth = clients.filter(
    (c) => new Date(c.createdAt) >= subDays(new Date(), 30)
  ).length;
  const newClientsLastMonth = clients.filter((c) => {
    const created = new Date(c.createdAt);
    return created >= subDays(new Date(), 60) && created < subDays(new Date(), 30);
  }).length;
  const clientGrowth =
    newClientsLastMonth > 0
      ? Math.round(
          ((newClientsThisMonth - newClientsLastMonth) / newClientsLastMonth) * 100
        )
      : 100;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Analytics"
        description="Track business performance and insights"
        actions={
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        }
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(stats.monthRevenue)}
          change={12}
          icon={DollarSign}
          color="green"
        />
        <MetricCard
          title="Appointments"
          value={appointments.filter((a) => a.status === "completed").length.toString()}
          change={8}
          icon={Calendar}
          color="blue"
        />
        <MetricCard
          title="New Clients"
          value={newClientsThisMonth.toString()}
          change={clientGrowth}
          icon={UserPlus}
          color="purple"
        />
        <MetricCard
          title="Rebooking Rate"
          value={`${stats.rebookingRate}%`}
          change={3}
          icon={Repeat}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Daily revenue for the past 30 days</CardDescription>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{formatCurrency(totalMonthRevenue)}</p>
                <p className="text-sm text-muted-foreground">Total this month</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Simple bar chart visualization */}
            <div className="h-[200px] flex items-end gap-1">
              {dailyRevenue.map((day, i) => (
                <div
                  key={i}
                  className="flex-1 bg-primary/80 hover:bg-primary transition-colors rounded-t cursor-pointer relative group"
                  style={{ height: `${(day.revenue / maxDayRevenue) * 100}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {day.date}: {formatCurrency(day.revenue)}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>30 days ago</span>
              <span>Today</span>
            </div>
          </CardContent>
        </Card>

        {/* Service Popularity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Popular Services
            </CardTitle>
            <CardDescription>Most booked services this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {servicePopularity.map((item, i) => {
                const percentage = Math.round(
                  (item.count /
                    servicePopularity.reduce((sum, s) => sum + s.count, 0)) *
                    100
                );
                return (
                  <div key={item.service?.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">
                        {item.service?.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {item.count} bookings ({percentage}%)
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Groomer Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Groomer Performance
            </CardTitle>
            <CardDescription>Revenue by team member</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {groomerStats.map((item) => {
                const percentage = Math.round(
                  (item.revenue /
                    groomerStats.reduce((sum, s) => sum + s.revenue, 0)) *
                    100
                );
                return (
                  <div key={item.groomer.id} className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-medium"
                      style={{ backgroundColor: item.groomer.color }}
                    >
                      {item.groomer.firstName[0]}
                      {item.groomer.lastName[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">
                          {item.groomer.firstName} {item.groomer.lastName}
                        </span>
                        <span className="text-sm font-medium">
                          {formatCurrency(item.revenue)}
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Utilization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Utilization Rate
            </CardTitle>
            <CardDescription>How busy is your schedule?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative h-32 w-32">
                <svg className="h-full w-full -rotate-90">
                  <circle
                    className="text-muted stroke-current"
                    strokeWidth="12"
                    fill="transparent"
                    r="54"
                    cx="64"
                    cy="64"
                  />
                  <circle
                    className="text-primary stroke-current"
                    strokeWidth="12"
                    strokeLinecap="round"
                    fill="transparent"
                    r="54"
                    cx="64"
                    cy="64"
                    strokeDasharray={`${stats.utilizationRate * 3.39} 339`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">{stats.utilizationRate}%</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                {stats.utilizationRate >= 80
                  ? "Great! Schedule is well-utilized"
                  : stats.utilizationRate >= 60
                  ? "Room for more appointments"
                  : "Consider marketing to fill slots"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Client Retention */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Client Insights
            </CardTitle>
            <CardDescription>Client base health metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Clients</p>
                  <p className="text-2xl font-bold">{clients.length}</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-green-50">
                  <p className="text-sm text-green-600">Active</p>
                  <p className="text-xl font-bold text-green-700">
                    {clients.filter((c) => c.isActive).length}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-amber-50">
                  <p className="text-sm text-amber-600">VIP</p>
                  <p className="text-xl font-bold text-amber-700">
                    {clients.filter((c) => c.tags.includes("VIP")).length}
                  </p>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Rebooking Rate</span>
                  <span className="text-sm font-medium">{stats.rebookingRate}%</span>
                </div>
                <Progress value={stats.rebookingRate} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ComponentType<{ className?: string }>;
  color: "green" | "blue" | "purple" | "amber";
}

function MetricCard({ title, value, change, icon: Icon, color }: MetricCardProps) {
  const colorClasses = {
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
    amber: "bg-amber-100 text-amber-600",
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            <div
              className={cn(
                "flex items-center gap-1 text-sm mt-2",
                change >= 0 ? "text-green-600" : "text-red-600"
              )}
            >
              {change >= 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{Math.abs(change)}% from last period</span>
            </div>
          </div>
          <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", colorClasses[color])}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
