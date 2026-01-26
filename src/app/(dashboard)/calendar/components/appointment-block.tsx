"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { StatusDot } from "@/components/ui/status-badge";
import { PetAvatarGroup } from "@/components/ui/pet-avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import { MapPin, AlertTriangle } from "lucide-react";
import type { Appointment, AppointmentStatus } from "@/lib/mock-data/types";
import { getClientById, getPetById, getGroomerById, getServiceById } from "@/lib/mock-data";

interface AppointmentBlockProps {
  appointment: Appointment;
  style?: React.CSSProperties;
  compact?: boolean;
  onClick?: () => void;
}

const statusColors: Record<AppointmentStatus, string> = {
  pending: "border-l-status-pending bg-status-pending/5",
  confirmed: "border-l-status-confirmed bg-status-confirmed/5",
  checked_in: "border-l-status-checked-in bg-status-checked-in/5",
  in_progress: "border-l-status-in-progress bg-status-in-progress/10",
  completed: "border-l-status-completed bg-status-completed/5",
  no_show: "border-l-status-no-show bg-status-no-show/5",
  canceled: "border-l-status-canceled bg-status-canceled/5 opacity-60",
};

export function AppointmentBlock({
  appointment,
  style,
  compact = false,
  onClick,
}: AppointmentBlockProps) {
  const client = getClientById(appointment.clientId);
  const groomer = getGroomerById(appointment.groomerId);
  const pets = appointment.services.map((s) => getPetById(s.petId)).filter(Boolean);
  const hasSafetyFlags = pets.some((p) => p && p.safetyFlags.length > 0);

  const blockContent = (
    <div
      className={cn(
        "rounded-md border border-l-4 p-2 cursor-pointer transition-all hover:shadow-md",
        statusColors[appointment.status],
        appointment.status === "in_progress" && "ring-2 ring-primary/20",
        compact ? "text-xs" : "text-sm"
      )}
      style={style}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-1 mb-1">
        <div className="flex items-center gap-1 min-w-0">
          <StatusDot status={appointment.status} size="sm" />
          <span className="font-medium truncate">
            {pets.map((p) => p?.name).join(", ")}
          </span>
          {hasSafetyFlags && (
            <AlertTriangle className="h-3 w-3 text-destructive shrink-0" />
          )}
        </div>
        {appointment.isMobile && (
          <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
        )}
      </div>

      {!compact && (
        <>
          <p className="text-muted-foreground truncate">
            {client?.firstName} {client?.lastName}
          </p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-muted-foreground">
              {format(new Date(appointment.startTime), "h:mm a")}
            </span>
            <span className="text-xs font-medium">
              ${appointment.totalPrice}
            </span>
          </div>
        </>
      )}
    </div>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{blockContent}</TooltipTrigger>
        <TooltipContent side="right" className="max-w-[300px]">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold">
                {pets.map((p) => p?.name).join(", ")}
              </span>
              <StatusDot status={appointment.status} />
            </div>
            <p className="text-sm">
              {client?.firstName} {client?.lastName}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>
                {format(new Date(appointment.startTime), "h:mm a")} -{" "}
                {format(new Date(appointment.endTime), "h:mm a")}
              </span>
              <span>|</span>
              <span>with {groomer?.firstName}</span>
            </div>
            {appointment.services.map((service, i) => {
              const svc = getServiceById(service.serviceId);
              return (
                <div key={i} className="text-xs">
                  {svc?.name} - ${service.price}
                </div>
              );
            })}
            {hasSafetyFlags && (
              <div className="flex items-center gap-1 text-xs text-destructive">
                <AlertTriangle className="h-3 w-3" />
                Safety flags - review before appointment
              </div>
            )}
            {appointment.isMobile && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                Mobile appointment
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Simple appointment card for lists
interface AppointmentCardProps {
  appointment: Appointment;
  onClick?: () => void;
}

export function AppointmentCard({ appointment, onClick }: AppointmentCardProps) {
  const client = getClientById(appointment.clientId);
  const groomer = getGroomerById(appointment.groomerId);
  const pets = appointment.services.map((s) => getPetById(s.petId)).filter(Boolean);
  const hasSafetyFlags = pets.some((p) => p && p.safetyFlags.length > 0);

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md",
        statusColors[appointment.status],
        "border-l-4"
      )}
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center min-w-[50px]">
        <span className="text-lg font-bold">
          {format(new Date(appointment.startTime), "h:mm")}
        </span>
        <span className="text-xs text-muted-foreground">
          {format(new Date(appointment.startTime), "a")}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <StatusDot status={appointment.status} />
          <span className="font-medium truncate">
            {pets.map((p) => p?.name).join(", ")}
          </span>
          {hasSafetyFlags && (
            <AlertTriangle className="h-4 w-4 text-destructive" />
          )}
          {appointment.isMobile && (
            <MapPin className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {client?.firstName} {client?.lastName} &bull; with{" "}
          {groomer?.firstName}
        </p>
      </div>

      <div className="text-right">
        <span className="font-semibold">${appointment.totalPrice}</span>
      </div>
    </div>
  );
}
