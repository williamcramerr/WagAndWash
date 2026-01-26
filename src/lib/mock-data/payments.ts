import { Payment } from "./types";
import { subDays, subHours } from "date-fns";

export const payments: Payment[] = [
  // Today's completed payments
  {
    id: "pay_1",
    appointmentId: "apt_1",
    clientId: "cli_1",
    amount: 70,
    tip: 15,
    method: "card",
    status: "completed",
    cardLast4: "4242",
    processedAt: new Date().toISOString(),
  },
  {
    id: "pay_2",
    appointmentId: "apt_5",
    clientId: "cli_5",
    amount: 50,
    tip: 10,
    method: "card",
    status: "completed",
    cardLast4: "1234",
    processedAt: subHours(new Date(), 1).toISOString(),
  },

  // Recent payments
  {
    id: "pay_3",
    appointmentId: "apt_15",
    clientId: "cli_7",
    amount: 45,
    tip: 8,
    method: "card",
    status: "completed",
    cardLast4: "5678",
    processedAt: subDays(new Date(), 4).toISOString(),
  },
  {
    id: "pay_4",
    appointmentId: "apt_13",
    clientId: "cli_1",
    amount: 70,
    tip: 20,
    method: "card",
    status: "completed",
    cardLast4: "4242",
    processedAt: subDays(new Date(), 42).toISOString(),
  },
  {
    id: "pay_5",
    appointmentId: "apt_14",
    clientId: "cli_3",
    amount: 125,
    tip: 25,
    method: "card",
    status: "completed",
    cardLast4: "9876",
    processedAt: subDays(new Date(), 35).toISOString(),
  },

  // Cash payments
  {
    id: "pay_6",
    appointmentId: "apt_hist_1",
    clientId: "cli_1",
    amount: 85,
    tip: 15,
    method: "cash",
    status: "completed",
    processedAt: subDays(new Date(), 10).toISOString(),
  },
  {
    id: "pay_7",
    appointmentId: "apt_hist_5",
    clientId: "cli_6",
    amount: 50,
    tip: 10,
    method: "cash",
    status: "completed",
    processedAt: subDays(new Date(), 22).toISOString(),
  },

  // Refunded payment
  {
    id: "pay_8",
    appointmentId: "apt_hist_10",
    clientId: "cli_11",
    amount: 75,
    tip: 0,
    method: "card",
    status: "refunded",
    cardLast4: "3456",
    processedAt: subDays(new Date(), 45).toISOString(),
    refundedAt: subDays(new Date(), 44).toISOString(),
    refundReason: "Service not completed as requested - client complaint resolved",
  },

  // Generate more historical payments
  ...Array.from({ length: 50 }, (_, i) => ({
    id: `pay_hist_${i + 1}`,
    appointmentId: `apt_hist_${i + 1}`,
    clientId: `cli_${(i % 40) + 1}`,
    amount: 50 + Math.floor(Math.random() * 100),
    tip: Math.floor(Math.random() * 25),
    method: (i % 5 === 0 ? "cash" : "card") as "card" | "cash" | "check",
    status: "completed" as const,
    cardLast4: i % 5 !== 0 ? `${1000 + i}` : undefined,
    processedAt: subDays(new Date(), 7 + i * 2).toISOString(),
  })),
];

export function getPaymentById(id: string): Payment | undefined {
  return payments.find((p) => p.id === id);
}

export function getPaymentsByClientId(clientId: string): Payment[] {
  return payments.filter((p) => p.clientId === clientId);
}

export function getPaymentsByAppointmentId(appointmentId: string): Payment | undefined {
  return payments.find((p) => p.appointmentId === appointmentId);
}

export function getRecentPayments(limit: number = 10): Payment[] {
  return [...payments]
    .filter((p) => p.status === "completed")
    .sort((a, b) => new Date(b.processedAt).getTime() - new Date(a.processedAt).getTime())
    .slice(0, limit);
}

export function getTodaysRevenue(): number {
  const today = new Date().toISOString().split("T")[0];
  return payments
    .filter((p) => p.processedAt.startsWith(today) && p.status === "completed")
    .reduce((sum, p) => sum + p.amount + p.tip, 0);
}

export function getWeekRevenue(): number {
  const weekAgo = subDays(new Date(), 7);
  return payments
    .filter(
      (p) =>
        new Date(p.processedAt) >= weekAgo && p.status === "completed"
    )
    .reduce((sum, p) => sum + p.amount + p.tip, 0);
}

export function getMonthRevenue(): number {
  const monthAgo = subDays(new Date(), 30);
  return payments
    .filter(
      (p) =>
        new Date(p.processedAt) >= monthAgo && p.status === "completed"
    )
    .reduce((sum, p) => sum + p.amount + p.tip, 0);
}

export function getTotalTips(): number {
  const monthAgo = subDays(new Date(), 30);
  return payments
    .filter(
      (p) =>
        new Date(p.processedAt) >= monthAgo && p.status === "completed"
    )
    .reduce((sum, p) => sum + p.tip, 0);
}
