"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Clock,
  CheckCircle2,
  LogIn,
  Play,
  CircleCheck,
  XCircle,
  Ban,
} from "lucide-react";
import type { AppointmentStatus } from "@/lib/mock-data/types";

interface StatusBadgeProps {
  status: AppointmentStatus;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const statusConfig: Record<
  AppointmentStatus,
  {
    label: string;
    variant: "pending" | "confirmed" | "checked-in" | "in-progress" | "completed" | "no-show" | "canceled";
    icon: React.ElementType;
  }
> = {
  pending: {
    label: "Pending",
    variant: "pending",
    icon: Clock,
  },
  confirmed: {
    label: "Confirmed",
    variant: "confirmed",
    icon: CheckCircle2,
  },
  checked_in: {
    label: "Checked In",
    variant: "checked-in",
    icon: LogIn,
  },
  in_progress: {
    label: "In Progress",
    variant: "in-progress",
    icon: Play,
  },
  completed: {
    label: "Completed",
    variant: "completed",
    icon: CircleCheck,
  },
  no_show: {
    label: "No Show",
    variant: "no-show",
    icon: XCircle,
  },
  canceled: {
    label: "Canceled",
    variant: "canceled",
    icon: Ban,
  },
};

const sizeClasses = {
  sm: "text-xs px-2 py-0.5",
  md: "text-xs px-2.5 py-0.5",
  lg: "text-sm px-3 py-1",
};

const iconSizes = {
  sm: "h-3 w-3",
  md: "h-3.5 w-3.5",
  lg: "h-4 w-4",
};

export function StatusBadge({
  status,
  showIcon = true,
  size = "md",
  className,
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      variant={config.variant}
      className={cn(
        "font-medium inline-flex items-center gap-1",
        sizeClasses[size],
        status === "in_progress" && "animate-pulse",
        className
      )}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      {config.label}
    </Badge>
  );
}

// Status dot for compact displays
interface StatusDotProps {
  status: AppointmentStatus;
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
  className?: string;
}

const dotSizes = {
  sm: "h-2 w-2",
  md: "h-2.5 w-2.5",
  lg: "h-3 w-3",
};

const dotColors: Record<AppointmentStatus, string> = {
  pending: "bg-status-pending",
  confirmed: "bg-status-confirmed",
  checked_in: "bg-status-checked-in",
  in_progress: "bg-status-in-progress",
  completed: "bg-status-completed",
  no_show: "bg-status-no-show",
  canceled: "bg-status-canceled",
};

export function StatusDot({
  status,
  size = "md",
  pulse,
  className,
}: StatusDotProps) {
  const shouldPulse = pulse ?? status === "in_progress";

  return (
    <span
      className={cn(
        "relative inline-flex rounded-full",
        dotSizes[size],
        dotColors[status],
        className
      )}
    >
      {shouldPulse && (
        <span
          className={cn(
            "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping",
            dotColors[status]
          )}
        />
      )}
    </span>
  );
}
