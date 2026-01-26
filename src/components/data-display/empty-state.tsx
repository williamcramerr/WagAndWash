"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Users,
  Dog,
  CreditCard,
  Search,
  FileX,
  Inbox,
  LucideIcon,
} from "lucide-react";

type EmptyStateType =
  | "appointments"
  | "clients"
  | "pets"
  | "payments"
  | "search"
  | "error"
  | "inbox"
  | "custom";

interface EmptyStateProps {
  type?: EmptyStateType;
  icon?: LucideIcon;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const defaultContent: Record<
  EmptyStateType,
  { icon: LucideIcon; title: string; description: string }
> = {
  appointments: {
    icon: Calendar,
    title: "No appointments",
    description: "You don't have any appointments scheduled. Book your first one!",
  },
  clients: {
    icon: Users,
    title: "No clients yet",
    description: "Start building your client base by adding your first client.",
  },
  pets: {
    icon: Dog,
    title: "No pets found",
    description: "This client doesn't have any pets registered yet.",
  },
  payments: {
    icon: CreditCard,
    title: "No payments",
    description: "No payment history to display.",
  },
  search: {
    icon: Search,
    title: "No results found",
    description: "Try adjusting your search or filters to find what you're looking for.",
  },
  error: {
    icon: FileX,
    title: "Something went wrong",
    description: "We couldn't load this content. Please try again.",
  },
  inbox: {
    icon: Inbox,
    title: "All caught up!",
    description: "You have no new notifications.",
  },
  custom: {
    icon: Inbox,
    title: "Nothing here",
    description: "No content to display.",
  },
};

export function EmptyState({
  type = "custom",
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  const defaults = defaultContent[type];
  const Icon = icon || defaults.icon;
  const displayTitle = title || defaults.title;
  const displayDescription = description || defaults.description;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4 text-center",
        className
      )}
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
        <Icon className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{displayTitle}</h3>
      <p className="text-sm text-muted-foreground max-w-md mb-6">
        {displayDescription}
      </p>
      {(action || secondaryAction) && (
        <div className="flex items-center gap-3">
          {action && (
            <Button onClick={action.onClick}>{action.label}</Button>
          )}
          {secondaryAction && (
            <Button variant="outline" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// Compact empty state for smaller areas
interface CompactEmptyStateProps {
  icon?: LucideIcon;
  message: string;
  className?: string;
}

export function CompactEmptyState({
  icon: Icon = Inbox,
  message,
  className,
}: CompactEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-8 text-center",
        className
      )}
    >
      <Icon className="h-8 w-8 text-muted-foreground/50 mb-2" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
