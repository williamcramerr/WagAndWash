// Core types for WagAndWash

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "checked_in"
  | "in_progress"
  | "completed"
  | "no_show"
  | "canceled";

export type PetSpecies = "dog" | "cat";

export type PetSize = "small" | "medium" | "large" | "xlarge";

export type CoatType = "short" | "medium" | "long" | "double" | "wire" | "curly";

export type SafetyFlagSeverity = "low" | "medium" | "high";

export interface SafetyFlag {
  id: string;
  type: "bite_risk" | "escape_risk" | "medical" | "behavioral" | "handling";
  severity: SafetyFlagSeverity;
  description: string;
  notes?: string;
  createdAt: string;
}

export interface VaccinationRecord {
  name: string;
  dateAdministered: string;
  expirationDate: string;
  verified: boolean;
  documentUrl?: string;
}

export interface Pet {
  id: string;
  clientId: string;
  name: string;
  species: PetSpecies;
  breed: string;
  color: string;
  dateOfBirth: string;
  weight: number;
  size: PetSize;
  coatType: CoatType;
  gender: "male" | "female";
  isNeutered: boolean;
  imageUrl?: string;
  safetyFlags: SafetyFlag[];
  vaccinations: VaccinationRecord[];
  groomingNotes: string;
  preferredGroomerId?: string;
  preferredStyle?: string;
  lastGroomDate?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  imageUrl?: string;
  tags: string[];
  notes: string;
  preferredContactMethod: "email" | "phone" | "sms";
  totalSpent: number;
  visitCount: number;
  lastVisit?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface ServiceModifier {
  id: string;
  name: string;
  priceAdjustment: number; // can be positive or negative
  durationAdjustment: number; // in minutes
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: "grooming" | "bath" | "specialty" | "add-on";
  basePrice: number;
  baseDuration: number; // in minutes
  sizeModifiers: {
    small: { price: number; duration: number };
    medium: { price: number; duration: number };
    large: { price: number; duration: number };
    xlarge: { price: number; duration: number };
  };
  coatModifiers?: {
    [key in CoatType]?: { price: number; duration: number };
  };
  isActive: boolean;
  requiresDeposit: boolean;
  depositAmount?: number;
  sortOrder: number;
}

export interface Groomer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  imageUrl?: string;
  color: string; // for calendar display
  specialties: string[];
  certifications: string[];
  bio: string;
  hireDate: string;
  isActive: boolean;
  isMobile: boolean;
  schedule: {
    [key: string]: { start: string; end: string } | null; // day of week -> hours
  };
}

export interface AppointmentService {
  serviceId: string;
  petId: string;
  price: number;
  duration: number;
  notes?: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  groomerId: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  services: AppointmentService[];
  totalPrice: number;
  depositPaid: number;
  isMobile: boolean;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  notes: string;
  internalNotes?: string;
  checkedInAt?: string;
  completedAt?: string;
  canceledAt?: string;
  cancelReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  appointmentId: string;
  clientId: string;
  amount: number;
  tip: number;
  method: "card" | "cash" | "check";
  status: "pending" | "completed" | "refunded" | "failed";
  cardLast4?: string;
  processedAt: string;
  refundedAt?: string;
  refundReason?: string;
}

export interface GroomingReport {
  id: string;
  appointmentId: string;
  petId: string;
  groomerId: string;
  coatCondition: "excellent" | "good" | "fair" | "poor";
  skinCondition: "healthy" | "dry" | "irritated" | "concerning";
  mattingLevel: "none" | "light" | "moderate" | "severe";
  behaviorRating: "excellent" | "good" | "fair" | "difficult";
  servicesPerformed: string[];
  findings: string;
  recommendations: string;
  beforePhotoUrl?: string;
  afterPhotoUrl?: string;
  createdAt: string;
}

export interface DashboardStats {
  todayAppointments: number;
  completedToday: number;
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  newClientsThisMonth: number;
  utilizationRate: number;
  rebookingRate: number;
}
