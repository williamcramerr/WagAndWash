"use client";

import * as React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, formatDate } from "@/lib/utils";
import {
  Bell,
  Calendar,
  CreditCard,
  XCircle,
  CheckCircle,
  AlertTriangle,
  User,
  Dog,
  MoreHorizontal,
  Check,
  Trash2,
  Archive,
  Settings,
  Filter,
} from "lucide-react";
import { format, subDays, subHours, subMinutes } from "date-fns";

type NotificationType = "booking" | "payment" | "cancellation" | "reminder" | "alert" | "system";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  clientId?: string;
  petId?: string;
  appointmentId?: string;
}

const mockNotifications: Notification[] = [
  {
    id: "notif_1",
    type: "booking",
    title: "New Appointment Booked",
    message: "Sarah Johnson booked Max for a Full Groom on Jan 28 at 10:00 AM",
    timestamp: subMinutes(new Date(), 15),
    read: false,
    actionUrl: "/appointments/apt_1",
    clientId: "cli_1",
  },
  {
    id: "notif_2",
    type: "payment",
    title: "Payment Received",
    message: "$85.00 received from Mike Peters (includes $15 tip)",
    timestamp: subHours(new Date(), 1),
    read: false,
    clientId: "cli_2",
  },
  {
    id: "notif_3",
    type: "cancellation",
    title: "Appointment Canceled",
    message: "Nicole White canceled Bella's appointment for tomorrow",
    timestamp: subHours(new Date(), 2),
    read: false,
    appointmentId: "apt_17",
  },
  {
    id: "notif_4",
    type: "reminder",
    title: "Vaccination Expiring",
    message: "Max's Bordetella vaccination expires in 5 days - remind client",
    timestamp: subHours(new Date(), 4),
    read: true,
    petId: "pet_1",
  },
  {
    id: "notif_5",
    type: "alert",
    title: "No-Show Alert",
    message: "Kevin Harris was a no-show for their 2:00 PM appointment",
    timestamp: subDays(new Date(), 1),
    read: true,
    clientId: "cli_14",
  },
  {
    id: "notif_6",
    type: "booking",
    title: "New Appointment Booked",
    message: "Emily Rodriguez booked Coco, Mochi, and Bruno for Jan 29",
    timestamp: subDays(new Date(), 1),
    read: true,
    actionUrl: "/appointments/apt_2",
  },
  {
    id: "notif_7",
    type: "system",
    title: "Weekly Report Ready",
    message: "Your weekly business report for Jan 13-19 is ready to view",
    timestamp: subDays(new Date(), 2),
    read: true,
    actionUrl: "/reports",
  },
  {
    id: "notif_8",
    type: "reminder",
    title: "Client Due for Rebook",
    message: "Robert Brown - Duke hasn't been groomed in 8 weeks",
    timestamp: subDays(new Date(), 2),
    read: true,
    clientId: "cli_8",
  },
  {
    id: "notif_9",
    type: "payment",
    title: "Deposit Received",
    message: "$25.00 deposit received for David Kim's upcoming appointment",
    timestamp: subDays(new Date(), 3),
    read: true,
    clientId: "cli_6",
  },
  {
    id: "notif_10",
    type: "booking",
    title: "Appointment Rescheduled",
    message: "Christopher Lee rescheduled Winston & Victoria to Feb 1",
    timestamp: subDays(new Date(), 3),
    read: true,
    appointmentId: "apt_6",
  },
];

const typeConfig: Record<NotificationType, { icon: React.ElementType; color: string; label: string }> = {
  booking: { icon: Calendar, color: "text-blue-600 bg-blue-100", label: "Bookings" },
  payment: { icon: CreditCard, color: "text-green-600 bg-green-100", label: "Payments" },
  cancellation: { icon: XCircle, color: "text-red-600 bg-red-100", label: "Cancellations" },
  reminder: { icon: Bell, color: "text-amber-600 bg-amber-100", label: "Reminders" },
  alert: { icon: AlertTriangle, color: "text-orange-600 bg-orange-100", label: "Alerts" },
  system: { icon: Settings, color: "text-gray-600 bg-gray-100", label: "System" },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState(mockNotifications);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [filter, setFilter] = React.useState<NotificationType | "all">("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = filter === "all"
    ? notifications
    : notifications.filter((n) => n.type === filter);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === filteredNotifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNotifications.map((n) => n.id));
    }
  };

  const markAsRead = (ids: string[]) => {
    setNotifications((prev) =>
      prev.map((n) => (ids.includes(n.id) ? { ...n, read: true } : n))
    );
    setSelectedIds([]);
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotifications = (ids: string[]) => {
    setNotifications((prev) => prev.filter((n) => !ids.includes(n.id)));
    setSelectedIds([]);
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    if (diffMinutes < 2880) return "Yesterday";
    return format(date, "MMM d");
  };

  const groupedByDate = React.useMemo(() => {
    const groups: { [key: string]: Notification[] } = {};

    filteredNotifications.forEach((notif) => {
      const date = format(notif.timestamp, "yyyy-MM-dd");
      const today = format(new Date(), "yyyy-MM-dd");
      const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");

      let key = format(notif.timestamp, "MMMM d, yyyy");
      if (date === today) key = "Today";
      else if (date === yesterday) key = "Yesterday";

      if (!groups[key]) groups[key] = [];
      groups[key].push(notif);
    });

    return groups;
  }, [filteredNotifications]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description={unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
              <Check className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
            <Link href="/settings">
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </Link>
          </div>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          All
          <Badge variant="secondary" className="ml-2">
            {notifications.length}
          </Badge>
        </Button>
        {(Object.keys(typeConfig) as NotificationType[]).map((type) => {
          const count = notifications.filter((n) => n.type === type).length;
          if (count === 0) return null;
          return (
            <Button
              key={type}
              variant={filter === type ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(type)}
            >
              {typeConfig[type].label}
              <Badge variant="secondary" className="ml-2">
                {count}
              </Badge>
            </Button>
          );
        })}
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <Card className="bg-muted/50">
          <CardContent className="py-3 flex items-center justify-between">
            <span className="text-sm">
              {selectedIds.length} selected
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => markAsRead(selectedIds)}
              >
                <Check className="h-4 w-4 mr-2" />
                Mark Read
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => deleteNotifications(selectedIds)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications List */}
      <div className="space-y-6">
        {Object.entries(groupedByDate).map(([date, notifs]) => (
          <div key={date}>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">{date}</h3>
            <div className="space-y-2">
              {notifs.map((notification) => {
                const config = typeConfig[notification.type];
                const Icon = config.icon;

                return (
                  <Card
                    key={notification.id}
                    className={cn(
                      "transition-colors hover:bg-accent/50",
                      !notification.read && "bg-primary/5 border-primary/20"
                    )}
                  >
                    <CardContent className="py-4">
                      <div className="flex items-start gap-4">
                        <Checkbox
                          checked={selectedIds.includes(notification.id)}
                          onCheckedChange={() => toggleSelect(notification.id)}
                        />
                        <div
                          className={cn(
                            "p-2 rounded-lg shrink-0",
                            config.color
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className={cn(
                                "font-medium",
                                !notification.read && "text-foreground"
                              )}>
                                {notification.title}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {notification.message}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-xs text-muted-foreground">
                                {formatTimestamp(notification.timestamp)}
                              </span>
                              {!notification.read && (
                                <div className="h-2 w-2 rounded-full bg-primary" />
                              )}
                            </div>
                          </div>
                          {notification.actionUrl && (
                            <Link
                              href={notification.actionUrl}
                              className="text-sm text-primary hover:underline mt-1 inline-block"
                            >
                              View details →
                            </Link>
                          )}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="shrink-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {!notification.read && (
                              <DropdownMenuItem onClick={() => markAsRead([notification.id])}>
                                <Check className="h-4 w-4 mr-2" />
                                Mark as read
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <Archive className="h-4 w-4 mr-2" />
                              Archive
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => deleteNotifications([notification.id])}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}

        {filteredNotifications.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-1">No notifications</h3>
              <p className="text-sm text-muted-foreground">
                {filter === "all"
                  ? "You're all caught up!"
                  : `No ${typeConfig[filter as NotificationType].label.toLowerCase()} notifications`}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
