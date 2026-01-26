import { Appointment, AppointmentStatus } from "./types";
import { addDays, addHours, format, subDays, startOfDay, setHours, setMinutes } from "date-fns";

// Helper to create a date at a specific time
function createDateTime(daysFromNow: number, hour: number, minute: number = 0): string {
  const date = addDays(new Date(), daysFromNow);
  return setMinutes(setHours(startOfDay(date), hour), minute).toISOString();
}

// Helper to add minutes to an ISO string
function addMinutesToDate(isoString: string, minutes: number): string {
  return addHours(new Date(isoString), minutes / 60).toISOString();
}

export const appointments: Appointment[] = [
  // Today's appointments
  {
    id: "apt_1",
    clientId: "cli_1",
    groomerId: "grm_1",
    startTime: createDateTime(0, 9, 0),
    endTime: createDateTime(0, 10, 30),
    status: "completed",
    services: [
      { serviceId: "svc_1", petId: "pet_1", price: 95, duration: 90 },
    ],
    totalPrice: 95,
    depositPaid: 25,
    isMobile: false,
    notes: "Regular appointment for Max",
    checkedInAt: createDateTime(0, 8, 55),
    completedAt: createDateTime(0, 10, 25),
    createdAt: subDays(new Date(), 7).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "apt_2",
    clientId: "cli_3",
    groomerId: "grm_1",
    startTime: createDateTime(0, 11, 0),
    endTime: createDateTime(0, 14, 0),
    status: "in_progress",
    services: [
      { serviceId: "svc_1", petId: "pet_3", price: 65, duration: 60, notes: "Teddy bear cut" },
      { serviceId: "svc_1", petId: "pet_4", price: 65, duration: 60, notes: "Top knot style" },
      { serviceId: "svc_4", petId: "pet_5", price: 45, duration: 45 },
    ],
    totalPrice: 175,
    depositPaid: 50,
    isMobile: false,
    notes: "All three pets. Owner will wait.",
    checkedInAt: createDateTime(0, 10, 55),
    createdAt: subDays(new Date(), 14).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "apt_3",
    clientId: "cli_4",
    groomerId: "grm_2",
    startTime: createDateTime(0, 10, 0),
    endTime: createDateTime(0, 12, 0),
    status: "checked_in",
    services: [
      { serviceId: "svc_5", petId: "pet_6", price: 85, duration: 105 },
    ],
    totalPrice: 85,
    depositPaid: 0,
    isMobile: true,
    address: {
      street: "321 Elm Court",
      city: "Riverside",
      state: "CA",
      zip: "92501",
    },
    notes: "Mobile grooming - anxious dog",
    internalNotes: "Owner must be present. Use calming techniques.",
    checkedInAt: createDateTime(0, 10, 5),
    createdAt: subDays(new Date(), 10).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "apt_4",
    clientId: "cli_6",
    groomerId: "grm_2",
    startTime: createDateTime(0, 14, 0),
    endTime: createDateTime(0, 16, 0),
    status: "confirmed",
    services: [
      { serviceId: "svc_1", petId: "pet_8", price: 105, duration: 120 },
    ],
    totalPrice: 105,
    depositPaid: 25,
    isMobile: false,
    notes: "Goldendoodle full groom",
    createdAt: subDays(new Date(), 21).toISOString(),
    updatedAt: subDays(new Date(), 1).toISOString(),
  },
  {
    id: "apt_5",
    clientId: "cli_5",
    groomerId: "grm_3",
    startTime: createDateTime(0, 10, 0),
    endTime: createDateTime(0, 11, 30),
    status: "completed",
    services: [
      { serviceId: "svc_7", petId: "pet_7", price: 80, duration: 90, notes: "Lion cut" },
    ],
    totalPrice: 80,
    depositPaid: 30,
    isMobile: false,
    notes: "Persian cat - lion cut",
    checkedInAt: createDateTime(0, 9, 55),
    completedAt: createDateTime(0, 11, 20),
    createdAt: subDays(new Date(), 14).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "apt_6",
    clientId: "cli_10",
    groomerId: "grm_4",
    startTime: createDateTime(0, 13, 0),
    endTime: createDateTime(0, 17, 0),
    status: "confirmed",
    services: [
      { serviceId: "svc_3", petId: "pet_12", price: 125, duration: 120 },
      { serviceId: "svc_3", petId: "pet_13", price: 125, duration: 120 },
    ],
    totalPrice: 250,
    depositPaid: 80,
    isMobile: false,
    notes: "Show dogs - continental clip for both",
    internalNotes: "VIP client. Must be perfect.",
    createdAt: subDays(new Date(), 28).toISOString(),
    updatedAt: subDays(new Date(), 2).toISOString(),
  },

  // Tomorrow's appointments
  {
    id: "apt_7",
    clientId: "cli_2",
    groomerId: "grm_1",
    startTime: createDateTime(1, 9, 0),
    endTime: createDateTime(1, 10, 0),
    status: "confirmed",
    services: [
      { serviceId: "svc_4", petId: "pet_2", price: 55, duration: 55 },
    ],
    totalPrice: 55,
    depositPaid: 0,
    isMobile: false,
    notes: "Lab bath and brush",
    createdAt: subDays(new Date(), 5).toISOString(),
    updatedAt: subDays(new Date(), 1).toISOString(),
  },
  {
    id: "apt_8",
    clientId: "cli_8",
    groomerId: "grm_3",
    startTime: createDateTime(1, 10, 30),
    endTime: createDateTime(1, 12, 30),
    status: "confirmed",
    services: [
      { serviceId: "svc_5", petId: "pet_10", price: 100, duration: 120 },
    ],
    totalPrice: 100,
    depositPaid: 0,
    isMobile: false,
    notes: "Senior German Shepherd - gentle handling",
    createdAt: subDays(new Date(), 7).toISOString(),
    updatedAt: subDays(new Date(), 1).toISOString(),
  },
  {
    id: "apt_9",
    clientId: "cli_9",
    groomerId: "grm_2",
    startTime: createDateTime(1, 9, 0),
    endTime: createDateTime(1, 11, 30),
    status: "confirmed",
    services: [
      { serviceId: "svc_5", petId: "pet_11", price: 100, duration: 120 },
    ],
    totalPrice: 100,
    depositPaid: 0,
    isMobile: false,
    notes: "Husky de-shed - escape artist!",
    createdAt: subDays(new Date(), 10).toISOString(),
    updatedAt: subDays(new Date(), 1).toISOString(),
  },
  {
    id: "apt_10",
    clientId: "cli_17",
    groomerId: "grm_4",
    startTime: createDateTime(1, 14, 0),
    endTime: createDateTime(1, 16, 0),
    status: "confirmed",
    services: [
      { serviceId: "svc_1", petId: "pet_21", price: 85, duration: 90 },
      { serviceId: "svc_14", petId: "pet_21", price: 15, duration: 15 },
    ],
    totalPrice: 100,
    depositPaid: 25,
    isMobile: false,
    notes: "Creative grooming - consult with owner on style",
    createdAt: subDays(new Date(), 14).toISOString(),
    updatedAt: subDays(new Date(), 1).toISOString(),
  },

  // Day after tomorrow
  {
    id: "apt_11",
    clientId: "cli_15",
    groomerId: "grm_3",
    startTime: createDateTime(2, 10, 0),
    endTime: createDateTime(2, 14, 0),
    status: "confirmed",
    services: [
      { serviceId: "svc_7", petId: "pet_16", price: 90, duration: 90 },
      { serviceId: "svc_7", petId: "pet_17", price: 70, duration: 60 },
      { serviceId: "svc_5", petId: "pet_18", price: 85, duration: 105 },
    ],
    totalPrice: 245,
    depositPaid: 50,
    isMobile: false,
    notes: "All three pets - 2 cats and 1 dog",
    createdAt: subDays(new Date(), 21).toISOString(),
    updatedAt: subDays(new Date(), 3).toISOString(),
  },
  {
    id: "apt_12",
    clientId: "cli_12",
    groomerId: "grm_2",
    startTime: createDateTime(2, 9, 0),
    endTime: createDateTime(2, 11, 0),
    status: "confirmed",
    services: [
      { serviceId: "svc_4", petId: "pet_15", price: 65, duration: 75 },
    ],
    totalPrice: 65,
    depositPaid: 0,
    isMobile: true,
    address: {
      street: "456 Chestnut Avenue",
      city: "Riverside",
      state: "CA",
      zip: "92504",
    },
    notes: "Mobile grooming - weekend appointment",
    createdAt: subDays(new Date(), 14).toISOString(),
    updatedAt: subDays(new Date(), 2).toISOString(),
  },

  // Past appointments (completed)
  {
    id: "apt_13",
    clientId: "cli_1",
    groomerId: "grm_1",
    startTime: subDays(new Date(), 42).toISOString(),
    endTime: addHours(subDays(new Date(), 42), 1.5).toISOString(),
    status: "completed",
    services: [
      { serviceId: "svc_1", petId: "pet_1", price: 95, duration: 90 },
    ],
    totalPrice: 95,
    depositPaid: 25,
    isMobile: false,
    notes: "Regular appointment",
    completedAt: addHours(subDays(new Date(), 42), 1.5).toISOString(),
    createdAt: subDays(new Date(), 56).toISOString(),
    updatedAt: subDays(new Date(), 42).toISOString(),
  },
  {
    id: "apt_14",
    clientId: "cli_3",
    groomerId: "grm_1",
    startTime: subDays(new Date(), 35).toISOString(),
    endTime: addHours(subDays(new Date(), 35), 3).toISOString(),
    status: "completed",
    services: [
      { serviceId: "svc_1", petId: "pet_3", price: 65, duration: 60 },
      { serviceId: "svc_1", petId: "pet_4", price: 65, duration: 60 },
      { serviceId: "svc_4", petId: "pet_5", price: 45, duration: 45 },
    ],
    totalPrice: 175,
    depositPaid: 50,
    isMobile: false,
    notes: "All three pets",
    completedAt: addHours(subDays(new Date(), 35), 3).toISOString(),
    createdAt: subDays(new Date(), 49).toISOString(),
    updatedAt: subDays(new Date(), 35).toISOString(),
  },
  {
    id: "apt_15",
    clientId: "cli_7",
    groomerId: "grm_1",
    startTime: subDays(new Date(), 4).toISOString(),
    endTime: addHours(subDays(new Date(), 4), 1).toISOString(),
    status: "completed",
    services: [
      { serviceId: "svc_4", petId: "pet_9", price: 45, duration: 55 },
    ],
    totalPrice: 45,
    depositPaid: 0,
    isMobile: false,
    notes: "Beagle bath",
    completedAt: addHours(subDays(new Date(), 4), 1).toISOString(),
    createdAt: subDays(new Date(), 11).toISOString(),
    updatedAt: subDays(new Date(), 4).toISOString(),
  },
  // No-show appointment
  {
    id: "apt_16",
    clientId: "cli_14",
    groomerId: "grm_5",
    startTime: subDays(new Date(), 3).toISOString(),
    endTime: addHours(subDays(new Date(), 3), 1).toISOString(),
    status: "no_show",
    services: [
      { serviceId: "svc_4", petId: "pet_19", price: 45, duration: 55 },
    ],
    totalPrice: 45,
    depositPaid: 0,
    isMobile: false,
    notes: "First appointment",
    internalNotes: "No show - tried calling, no answer. Will follow up.",
    createdAt: subDays(new Date(), 10).toISOString(),
    updatedAt: subDays(new Date(), 3).toISOString(),
  },
  // Canceled appointment
  {
    id: "apt_17",
    clientId: "cli_11",
    groomerId: "grm_1",
    startTime: createDateTime(3, 10, 0),
    endTime: createDateTime(3, 11, 0),
    status: "canceled",
    services: [
      { serviceId: "svc_4", petId: "pet_14", price: 45, duration: 55 },
    ],
    totalPrice: 45,
    depositPaid: 0,
    isMobile: false,
    notes: "Cavalier bath",
    canceledAt: subDays(new Date(), 1).toISOString(),
    cancelReason: "Client needs to reschedule due to work conflict",
    createdAt: subDays(new Date(), 14).toISOString(),
    updatedAt: subDays(new Date(), 1).toISOString(),
  },

  // More future appointments
  {
    id: "apt_18",
    clientId: "cli_13",
    groomerId: "grm_1",
    startTime: createDateTime(3, 9, 0),
    endTime: createDateTime(3, 10, 30),
    status: "pending",
    services: [
      { serviceId: "svc_1", petId: "pet_3", price: 65, duration: 60 },
    ],
    totalPrice: 65,
    depositPaid: 0,
    isMobile: false,
    notes: "Referral source - give great service!",
    createdAt: subDays(new Date(), 2).toISOString(),
    updatedAt: subDays(new Date(), 2).toISOString(),
  },
  {
    id: "apt_19",
    clientId: "cli_16",
    groomerId: "grm_2",
    startTime: createDateTime(4, 10, 0),
    endTime: createDateTime(4, 11, 0),
    status: "confirmed",
    services: [
      { serviceId: "svc_4", petId: "pet_20", price: 55, duration: 55 },
    ],
    totalPrice: 55,
    depositPaid: 0,
    isMobile: false,
    notes: "Doberman bath",
    createdAt: subDays(new Date(), 7).toISOString(),
    updatedAt: subDays(new Date(), 1).toISOString(),
  },
  {
    id: "apt_20",
    clientId: "cli_24",
    groomerId: "grm_2",
    startTime: createDateTime(5, 9, 0),
    endTime: createDateTime(5, 12, 0),
    status: "confirmed",
    services: [
      { serviceId: "svc_1", petId: "pet_28", price: 145, duration: 165 },
      { serviceId: "svc_5", petId: "pet_28", price: 45, duration: 45 },
    ],
    totalPrice: 190,
    depositPaid: 50,
    isMobile: false,
    notes: "Bernese Mountain Dog - full groom with de-shed",
    createdAt: subDays(new Date(), 14).toISOString(),
    updatedAt: subDays(new Date(), 3).toISOString(),
  },
  // More appointments to fill out the calendar
  {
    id: "apt_21",
    clientId: "cli_30",
    groomerId: "grm_5",
    startTime: createDateTime(1, 14, 0),
    endTime: createDateTime(1, 17, 0),
    status: "confirmed",
    services: [
      { serviceId: "svc_5", petId: "pet_34", price: 70, duration: 90 },
      { serviceId: "svc_5", petId: "pet_35", price: 70, duration: 90 },
    ],
    totalPrice: 140,
    depositPaid: 0,
    isMobile: false,
    notes: "Two cattle dogs - de-shed",
    createdAt: subDays(new Date(), 10).toISOString(),
    updatedAt: subDays(new Date(), 1).toISOString(),
  },
  {
    id: "apt_22",
    clientId: "cli_37",
    groomerId: "grm_4",
    startTime: createDateTime(2, 9, 0),
    endTime: createDateTime(2, 11, 0),
    status: "confirmed",
    services: [
      { serviceId: "svc_1", petId: "pet_44", price: 65, duration: 75 },
    ],
    totalPrice: 65,
    depositPaid: 25,
    isMobile: false,
    notes: "VIP - fashion designer's toy poodle",
    createdAt: subDays(new Date(), 21).toISOString(),
    updatedAt: subDays(new Date(), 5).toISOString(),
  },
  {
    id: "apt_23",
    clientId: "cli_50",
    groomerId: "grm_1",
    startTime: createDateTime(3, 14, 0),
    endTime: createDateTime(3, 16, 0),
    status: "confirmed",
    services: [
      { serviceId: "svc_1", petId: "pet_51", price: 65, duration: 60 },
      { serviceId: "svc_1", petId: "pet_52", price: 65, duration: 60 },
    ],
    totalPrice: 130,
    depositPaid: 0,
    isMobile: false,
    notes: "VIP client - two Cavaliers",
    createdAt: subDays(new Date(), 28).toISOString(),
    updatedAt: subDays(new Date(), 7).toISOString(),
  },
  {
    id: "apt_24",
    clientId: "cli_34",
    groomerId: "grm_2",
    startTime: createDateTime(6, 9, 0),
    endTime: createDateTime(6, 12, 0),
    status: "pending",
    services: [
      { serviceId: "svc_1", petId: "pet_40", price: 175, duration: 180 },
    ],
    totalPrice: 175,
    depositPaid: 50,
    isMobile: true,
    address: {
      street: "444 Bluebell Lane",
      city: "Springfield",
      state: "CA",
      zip: "90232",
    },
    notes: "Mobile - Newfoundland full groom",
    createdAt: subDays(new Date(), 3).toISOString(),
    updatedAt: subDays(new Date(), 3).toISOString(),
  },
  {
    id: "apt_25",
    clientId: "cli_27",
    groomerId: "grm_3",
    startTime: createDateTime(4, 11, 0),
    endTime: createDateTime(4, 13, 0),
    status: "confirmed",
    services: [
      { serviceId: "svc_1", petId: "pet_31", price: 95, duration: 120 },
    ],
    totalPrice: 95,
    depositPaid: 0,
    isMobile: false,
    notes: "Senior Irish Setter - gentle handling",
    createdAt: subDays(new Date(), 14).toISOString(),
    updatedAt: subDays(new Date(), 2).toISOString(),
  },

  // Additional past appointments for history
  ...Array.from({ length: 30 }, (_, i) => ({
    id: `apt_hist_${i + 1}`,
    clientId: `cli_${(i % 40) + 1}`,
    groomerId: `grm_${(i % 5) + 1}`,
    startTime: subDays(new Date(), 7 + i * 3).toISOString(),
    endTime: addHours(subDays(new Date(), 7 + i * 3), 1.5).toISOString(),
    status: "completed" as AppointmentStatus,
    services: [
      {
        serviceId: i % 3 === 0 ? "svc_1" : i % 3 === 1 ? "svc_4" : "svc_5",
        petId: `pet_${(i % 50) + 1}`,
        price: i % 3 === 0 ? 85 : i % 3 === 1 ? 50 : 75,
        duration: i % 3 === 0 ? 90 : i % 3 === 1 ? 60 : 90,
      },
    ],
    totalPrice: i % 3 === 0 ? 85 : i % 3 === 1 ? 50 : 75,
    depositPaid: i % 4 === 0 ? 25 : 0,
    isMobile: i % 6 === 0,
    notes: "Regular appointment",
    completedAt: addHours(subDays(new Date(), 7 + i * 3), 1.5).toISOString(),
    createdAt: subDays(new Date(), 14 + i * 3).toISOString(),
    updatedAt: subDays(new Date(), 7 + i * 3).toISOString(),
  })),
];

export function getAppointmentById(id: string): Appointment | undefined {
  return appointments.find((a) => a.id === id);
}

export function getAppointmentsByClientId(clientId: string): Appointment[] {
  return appointments.filter((a) => a.clientId === clientId);
}

export function getAppointmentsByGroomerId(groomerId: string): Appointment[] {
  return appointments.filter((a) => a.groomerId === groomerId);
}

export function getAppointmentsByDate(date: Date): Appointment[] {
  const dateStr = format(date, "yyyy-MM-dd");
  return appointments.filter((a) => a.startTime.startsWith(dateStr));
}

export function getTodaysAppointments(): Appointment[] {
  return getAppointmentsByDate(new Date());
}

export function getUpcomingAppointments(limit: number = 10): Appointment[] {
  const now = new Date();
  return appointments
    .filter((a) => new Date(a.startTime) > now && a.status !== "canceled")
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, limit);
}

export function getPastAppointments(clientId: string): Appointment[] {
  const now = new Date();
  return appointments
    .filter(
      (a) =>
        a.clientId === clientId &&
        new Date(a.startTime) < now &&
        a.status === "completed"
    )
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
}

export function getAppointmentsByStatus(status: AppointmentStatus): Appointment[] {
  return appointments.filter((a) => a.status === status);
}

export function getMobileAppointments(): Appointment[] {
  return appointments.filter((a) => a.isMobile && a.status !== "canceled");
}

export function getAppointmentsForWeek(startDate: Date): Appointment[] {
  const start = startOfDay(startDate);
  const end = addDays(start, 7);
  return appointments.filter((a) => {
    const aptDate = new Date(a.startTime);
    return aptDate >= start && aptDate < end;
  });
}

export function getAppointmentsForMonth(date: Date): Appointment[] {
  const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
  const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
  return appointments.filter((a) => {
    const aptDate = new Date(a.startTime);
    return aptDate >= monthStart && aptDate <= monthEnd;
  });
}

export function getAppointmentsByPetId(petId: string): Appointment[] {
  return appointments.filter((a) =>
    a.services.some((s) => s.petId === petId)
  );
}
