// Export all types
export * from "./types";

// Export data and helpers
export * from "./groomers";
export * from "./services";
export * from "./clients";
export * from "./pets";
export * from "./appointments";
export * from "./payments";

// Import for dashboard stats calculation
import { getTodaysAppointments, getAppointmentsByStatus } from "./appointments";
import { getTodaysRevenue, getWeekRevenue, getMonthRevenue } from "./payments";
import { clients } from "./clients";
import { subDays } from "date-fns";
import type { DashboardStats } from "./types";

export function getDashboardStats(): DashboardStats {
  const todayAppts = getTodaysAppointments();
  const completedToday = todayAppts.filter((a) => a.status === "completed").length;

  // Calculate new clients this month
  const monthAgo = subDays(new Date(), 30);
  const newClientsThisMonth = clients.filter(
    (c) => new Date(c.createdAt) >= monthAgo
  ).length;

  // Calculate utilization (appointments / available slots)
  // Assuming 8 appointments per groomer per day, 5 groomers
  const totalSlots = 5 * 8;
  const utilizationRate = Math.round((todayAppts.length / totalSlots) * 100);

  // Calculate rebooking rate (clients who've booked again within 8 weeks)
  const rebookingRate = 78; // Mock value - would calculate from real data

  return {
    todayAppointments: todayAppts.length,
    completedToday,
    todayRevenue: getTodaysRevenue(),
    weekRevenue: getWeekRevenue(),
    monthRevenue: getMonthRevenue(),
    newClientsThisMonth,
    utilizationRate,
    rebookingRate,
  };
}

// Activity feed type
export interface ActivityItem {
  id: string;
  type: "booking" | "payment" | "cancellation" | "check_in" | "completion";
  title: string;
  description: string;
  timestamp: string;
  clientId?: string;
  appointmentId?: string;
}

export function getRecentActivity(limit: number = 10): ActivityItem[] {
  // Generate mock activity from recent data
  const activities: ActivityItem[] = [
    {
      id: "act_1",
      type: "completion",
      title: "Appointment completed",
      description: "Max's full groom with Lisa completed",
      timestamp: new Date().toISOString(),
      clientId: "cli_1",
      appointmentId: "apt_1",
    },
    {
      id: "act_2",
      type: "check_in",
      title: "Client checked in",
      description: "Emily Rodriguez checked in with Coco, Mochi, and Bruno",
      timestamp: subDays(new Date(), 0).toISOString(),
      clientId: "cli_3",
      appointmentId: "apt_2",
    },
    {
      id: "act_3",
      type: "payment",
      title: "Payment received",
      description: "$85.00 from Sarah Johnson (includes $15 tip)",
      timestamp: subDays(new Date(), 0).toISOString(),
      clientId: "cli_1",
    },
    {
      id: "act_4",
      type: "booking",
      title: "New booking",
      description: "David Kim booked Cooper for Jan 28",
      timestamp: subDays(new Date(), 1).toISOString(),
      clientId: "cli_6",
      appointmentId: "apt_4",
    },
    {
      id: "act_5",
      type: "cancellation",
      title: "Appointment canceled",
      description: "Nicole White canceled Bella's appointment",
      timestamp: subDays(new Date(), 1).toISOString(),
      clientId: "cli_11",
      appointmentId: "apt_17",
    },
    {
      id: "act_6",
      type: "booking",
      title: "New booking",
      description: "Christopher Lee booked Winston & Victoria",
      timestamp: subDays(new Date(), 2).toISOString(),
      clientId: "cli_10",
      appointmentId: "apt_6",
    },
    {
      id: "act_7",
      type: "completion",
      title: "Appointment completed",
      description: "Luna's cat grooming with Sarah completed",
      timestamp: subDays(new Date(), 0).toISOString(),
      clientId: "cli_5",
      appointmentId: "apt_5",
    },
    {
      id: "act_8",
      type: "payment",
      title: "Payment received",
      description: "$60.00 from Amanda Taylor (includes $10 tip)",
      timestamp: subDays(new Date(), 0).toISOString(),
      clientId: "cli_5",
    },
  ];

  return activities.slice(0, limit);
}

// Reminders type
export interface ReminderItem {
  id: string;
  type: "rebook" | "vaccination" | "waitlist" | "follow_up";
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  clientId?: string;
  petId?: string;
  dueDate?: string;
}

export function getReminders(): ReminderItem[] {
  return [
    {
      id: "rem_1",
      type: "vaccination",
      title: "Vaccination expiring",
      description: "Max's Bordetella vaccination expires in 5 days",
      priority: "high",
      clientId: "cli_1",
      petId: "pet_1",
      dueDate: subDays(new Date(), -5).toISOString(),
    },
    {
      id: "rem_2",
      type: "rebook",
      title: "Client due for rebook",
      description: "Robert Brown - Duke hasn't been groomed in 8 weeks",
      priority: "medium",
      clientId: "cli_8",
      petId: "pet_10",
    },
    {
      id: "rem_3",
      type: "follow_up",
      title: "Follow up needed",
      description: "Kevin Harris was a no-show - follow up call needed",
      priority: "high",
      clientId: "cli_14",
    },
    {
      id: "rem_4",
      type: "rebook",
      title: "VIP client due",
      description: "Michelle Thompson - usually books every 4 weeks",
      priority: "medium",
      clientId: "cli_13",
    },
    {
      id: "rem_5",
      type: "vaccination",
      title: "Vaccination expired",
      description: "Storm's Bordetella is expired - update before next visit",
      priority: "high",
      clientId: "cli_9",
      petId: "pet_11",
    },
  ];
}
