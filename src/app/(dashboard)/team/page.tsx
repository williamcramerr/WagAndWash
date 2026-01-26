"use client";

import * as React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, formatCurrency, formatDate, getInitials } from "@/lib/utils";
import {
  Plus,
  MoreHorizontal,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Star,
  Clock,
  Award,
  Edit,
  Trash2,
  Eye,
  Users,
  TrendingUp,
} from "lucide-react";
import {
  groomers,
  appointments,
  type Groomer,
} from "@/lib/mock-data";

export default function TeamPage() {
  const activeGroomers = groomers.filter((g) => g.isActive);
  const mobileGroomers = groomers.filter((g) => g.isMobile);

  // Calculate team stats
  const totalAppointmentsCompleted = appointments.filter(
    (a) => a.status === "completed"
  ).length;
  const totalRevenue = appointments
    .filter((a) => a.status === "completed")
    .reduce((sum, a) => sum + a.totalPrice, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team"
        description="Manage your grooming team"
        actions={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Team Member
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-2xl font-bold">{activeGroomers.length}</div>
                <p className="text-xs text-muted-foreground">Active Groomers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-2xl font-bold">{mobileGroomers.length}</div>
                <p className="text-xs text-muted-foreground">Mobile Groomers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-2xl font-bold">{totalAppointmentsCompleted}</div>
                <p className="text-xs text-muted-foreground">Completed Jobs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                <p className="text-xs text-muted-foreground">Team Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groomers.map((groomer) => (
          <GroomerCard key={groomer.id} groomer={groomer} />
        ))}
      </div>
    </div>
  );
}

function GroomerCard({ groomer }: { groomer: Groomer }) {
  const groomerAppointments = appointments.filter(
    (a) => a.groomerId === groomer.id && a.status === "completed"
  );
  const revenue = groomerAppointments.reduce((sum, a) => sum + a.totalPrice, 0);
  const appointmentCount = groomerAppointments.length;

  // Mock rating
  const rating = 4.5 + Math.random() * 0.5;

  return (
    <Card className={cn(!groomer.isActive && "opacity-60")}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={groomer.imageUrl} />
              <AvatarFallback
                className="text-lg"
                style={{ backgroundColor: groomer.color, color: "white" }}
              >
                {getInitials(`${groomer.firstName} ${groomer.lastName}`)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">
                {groomer.firstName} {groomer.lastName}
              </h3>
              <div className="flex items-center gap-2">
                {groomer.isActive ? (
                  <Badge variant="default" className="bg-green-100 text-green-700">
                    Active
                  </Badge>
                ) : (
                  <Badge variant="secondary">Inactive</Badge>
                )}
                {groomer.isMobile && (
                  <Badge variant="outline">
                    <MapPin className="h-3 w-3 mr-1" />
                    Mobile
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Eye className="h-4 w-4 mr-2" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Edit Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Calendar className="h-4 w-4 mr-2" />
                View Schedule
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Deactivate
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Contact */}
        <div className="flex items-center gap-4 text-sm">
          <a
            href={`mailto:${groomer.email}`}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            <Mail className="h-4 w-4" />
            Email
          </a>
          <a
            href={`tel:${groomer.phone}`}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            <Phone className="h-4 w-4" />
            Call
          </a>
        </div>

        {/* Specialties */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">Specialties</p>
          <div className="flex flex-wrap gap-1">
            {groomer.specialties.slice(0, 3).map((specialty, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {specialty}
              </Badge>
            ))}
            {groomer.specialties.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{groomer.specialties.length - 3}
              </Badge>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-lg font-semibold">{appointmentCount}</p>
            <p className="text-xs text-muted-foreground">Jobs</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold">{formatCurrency(revenue)}</p>
            <p className="text-xs text-muted-foreground">Revenue</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-lg font-semibold">{rating.toFixed(1)}</span>
            </div>
            <p className="text-xs text-muted-foreground">Rating</p>
          </div>
        </div>

        {/* Certifications */}
        {groomer.certifications.length > 0 && (
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground mb-2">Certifications</p>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              <span className="text-sm">
                {groomer.certifications.slice(0, 2).join(", ")}
                {groomer.certifications.length > 2 &&
                  ` +${groomer.certifications.length - 2} more`}
              </span>
            </div>
          </div>
        )}

        {/* Hire Date */}
        <div className="pt-4 border-t flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Joined {formatDate(groomer.hireDate)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
