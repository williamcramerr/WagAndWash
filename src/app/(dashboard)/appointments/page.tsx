"use client";

import * as React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge, StatusDot } from "@/components/ui/status-badge";
import { PetAvatar } from "@/components/ui/pet-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, formatCurrency, formatDate, formatTime } from "@/lib/utils";
import {
  Plus,
  Search,
  MoreHorizontal,
  MapPin,
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import {
  appointments,
  getClientById,
  getPetById,
  getGroomerById,
  getServiceById,
  getActiveGroomers,
  type Appointment,
  type AppointmentStatus,
} from "@/lib/mock-data";

const statusFilters: { value: AppointmentStatus | "all"; label: string }[] = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "checked_in", label: "Checked In" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "no_show", label: "No Show" },
  { value: "canceled", label: "Canceled" },
];

export default function AppointmentsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [groomerFilter, setGroomerFilter] = React.useState<string>("all");
  const [dateFilter, setDateFilter] = React.useState<string>("upcoming");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 15;

  const groomers = getActiveGroomers();

  const filteredAppointments = React.useMemo(() => {
    let result = [...appointments];
    const now = new Date();

    // Date filter
    if (dateFilter === "upcoming") {
      result = result.filter(
        (apt) => new Date(apt.startTime) > now && apt.status !== "canceled"
      );
    } else if (dateFilter === "today") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      result = result.filter((apt) => {
        const aptDate = new Date(apt.startTime);
        return aptDate >= today && aptDate < tomorrow;
      });
    } else if (dateFilter === "past") {
      result = result.filter((apt) => new Date(apt.startTime) <= now);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((apt) => {
        const client = getClientById(apt.clientId);
        const pets = apt.services.map((s) => getPetById(s.petId));
        return (
          client?.firstName.toLowerCase().includes(query) ||
          client?.lastName.toLowerCase().includes(query) ||
          pets.some((p) => p?.name.toLowerCase().includes(query))
        );
      });
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((apt) => apt.status === statusFilter);
    }

    // Groomer filter
    if (groomerFilter !== "all") {
      result = result.filter((apt) => apt.groomerId === groomerFilter);
    }

    // Sort by date
    result.sort((a, b) => {
      const dateA = new Date(a.startTime).getTime();
      const dateB = new Date(b.startTime).getTime();
      return dateFilter === "past" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [searchQuery, statusFilter, groomerFilter, dateFilter]);

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayAppointments = appointments.filter((apt) => {
    const aptDate = new Date(apt.startTime);
    return aptDate >= today && aptDate < tomorrow && apt.status !== "canceled";
  });

  const upcomingCount = appointments.filter(
    (apt) => new Date(apt.startTime) > new Date() && apt.status !== "canceled"
  ).length;

  const completedToday = todayAppointments.filter(
    (apt) => apt.status === "completed"
  ).length;

  const todayRevenue = todayAppointments
    .filter((apt) => apt.status === "completed")
    .reduce((sum, apt) => sum + apt.totalPrice, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Appointments"
        description="Manage and track all appointments"
        actions={
          <Button asChild>
            <Link href="/appointments/new">
              <Plus className="h-4 w-4 mr-2" />
              New Appointment
            </Link>
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-2xl font-bold">{todayAppointments.length}</div>
                <p className="text-xs text-muted-foreground">Today</p>
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
                  {completedToday}/{todayAppointments.length}
                </div>
                <p className="text-xs text-muted-foreground">Completed Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-2xl font-bold">{upcomingCount}</div>
                <p className="text-xs text-muted-foreground">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{formatCurrency(todayRevenue)}</div>
            <p className="text-xs text-muted-foreground">Today&apos;s Revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Date Tabs */}
      <Tabs value={dateFilter} onValueChange={setDateFilter}>
        <TabsList>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by client or pet name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statusFilters.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={groomerFilter} onValueChange={setGroomerFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Groomer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Groomers</SelectItem>
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

      {/* Appointments Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Pet(s)</TableHead>
              <TableHead>Services</TableHead>
              <TableHead>Groomer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedAppointments.length > 0 ? (
              paginatedAppointments.map((appointment) => (
                <AppointmentRow key={appointment.id} appointment={appointment} />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <p className="text-muted-foreground">No appointments found</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredAppointments.length)} of{" "}
            {filteredAppointments.length} appointments
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function AppointmentRow({ appointment }: { appointment: Appointment }) {
  const client = getClientById(appointment.clientId);
  const groomer = getGroomerById(appointment.groomerId);
  const pets = appointment.services.map((s) => getPetById(s.petId)).filter(Boolean);
  const services = appointment.services
    .map((s) => getServiceById(s.serviceId)?.name)
    .filter(Boolean);
  const hasSafetyFlags = pets.some((p) => p && p.safetyFlags.length > 0);

  return (
    <TableRow className="group">
      <TableCell>
        <div className="flex items-center gap-2">
          {appointment.isMobile && (
            <MapPin className="h-4 w-4 text-muted-foreground" />
          )}
          <div>
            <div className="font-medium">{formatDate(appointment.startTime)}</div>
            <div className="text-sm text-muted-foreground">
              {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Link
          href={`/clients/${client?.id}`}
          className="hover:underline font-medium"
        >
          {client?.firstName} {client?.lastName}
        </Link>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
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
          <span className="text-sm">
            {pets.map((p) => p?.name).join(", ")}
          </span>
          {hasSafetyFlags && (
            <AlertTriangle className="h-4 w-4 text-destructive" />
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {services.slice(0, 2).map((service, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {service}
            </Badge>
          ))}
          {services.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{services.length - 2}
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: groomer?.color }}
          />
          <span>{groomer?.firstName}</span>
        </div>
      </TableCell>
      <TableCell>
        <StatusBadge status={appointment.status} />
      </TableCell>
      <TableCell className="text-right font-medium">
        {formatCurrency(appointment.totalPrice)}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              Edit Appointment
            </DropdownMenuItem>
            {appointment.status === "pending" && (
              <DropdownMenuItem>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Confirm
              </DropdownMenuItem>
            )}
            {(appointment.status === "confirmed" ||
              appointment.status === "pending") && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel Appointment
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
