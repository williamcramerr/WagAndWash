import { Groomer } from "./types";

export const groomers: Groomer[] = [
  {
    id: "grm_1",
    firstName: "Lisa",
    lastName: "Martinez",
    email: "lisa@wagandwash.com",
    phone: "5551234001",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
    color: "#E07850", // Primary coral
    specialties: ["Hand stripping", "Scissor cuts", "Show grooming"],
    certifications: ["NCMG Certified", "Fear Free Certified"],
    bio: "15 years of grooming experience with a specialty in terriers and hand stripping.",
    hireDate: "2019-03-15",
    isActive: true,
    isMobile: false,
    schedule: {
      monday: { start: "09:00", end: "17:00" },
      tuesday: { start: "09:00", end: "17:00" },
      wednesday: { start: "09:00", end: "17:00" },
      thursday: { start: "09:00", end: "17:00" },
      friday: { start: "09:00", end: "15:00" },
      saturday: null,
      sunday: null,
    },
  },
  {
    id: "grm_2",
    firstName: "Mike",
    lastName: "Chen",
    email: "mike@wagandwash.com",
    phone: "5551234002",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    color: "#5A8A6E", // Secondary sage
    specialties: ["Large breeds", "De-shedding", "Doodles"],
    certifications: ["IPG Certified", "CPR Certified"],
    bio: "Specialist in large breeds and complex coat types. Known for patience with anxious dogs.",
    hireDate: "2020-06-01",
    isActive: true,
    isMobile: true,
    schedule: {
      monday: { start: "08:00", end: "16:00" },
      tuesday: { start: "08:00", end: "16:00" },
      wednesday: null,
      thursday: { start: "08:00", end: "16:00" },
      friday: { start: "08:00", end: "16:00" },
      saturday: { start: "09:00", end: "14:00" },
      sunday: null,
    },
  },
  {
    id: "grm_3",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah@wagandwash.com",
    phone: "5551234003",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    color: "#E6A332", // Accent amber
    specialties: ["Cats", "Small breeds", "Senior pets"],
    certifications: ["CFMG Certified", "Fear Free Certified"],
    bio: "Cat grooming specialist with gentle handling techniques for senior and anxious pets.",
    hireDate: "2021-01-10",
    isActive: true,
    isMobile: false,
    schedule: {
      monday: { start: "10:00", end: "18:00" },
      tuesday: { start: "10:00", end: "18:00" },
      wednesday: { start: "10:00", end: "18:00" },
      thursday: null,
      friday: { start: "10:00", end: "18:00" },
      saturday: { start: "09:00", end: "15:00" },
      sunday: null,
    },
  },
  {
    id: "grm_4",
    firstName: "David",
    lastName: "Kim",
    email: "david@wagandwash.com",
    phone: "5551234004",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    color: "#7C3AED", // Purple
    specialties: ["Creative grooming", "Asian fusion", "Poodles"],
    certifications: ["Master Groomer", "Barkleigh Honors Winner"],
    bio: "Award-winning creative groomer specializing in poodles and Asian fusion styles.",
    hireDate: "2022-04-20",
    isActive: true,
    isMobile: false,
    schedule: {
      monday: { start: "09:00", end: "17:00" },
      tuesday: null,
      wednesday: { start: "09:00", end: "17:00" },
      thursday: { start: "09:00", end: "17:00" },
      friday: { start: "09:00", end: "17:00" },
      saturday: { start: "10:00", end: "16:00" },
      sunday: null,
    },
  },
  {
    id: "grm_5",
    firstName: "Emma",
    lastName: "Williams",
    email: "emma@wagandwash.com",
    phone: "5551234005",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    color: "#EC4899", // Pink
    specialties: ["Puppies", "First-time grooms", "Breed standard cuts"],
    certifications: ["NCMG Certified", "Puppy Start Right"],
    bio: "Specializes in puppy introductions and making first groom experiences positive.",
    hireDate: "2023-02-01",
    isActive: true,
    isMobile: true,
    schedule: {
      monday: { start: "08:00", end: "16:00" },
      tuesday: { start: "08:00", end: "16:00" },
      wednesday: { start: "08:00", end: "16:00" },
      thursday: { start: "08:00", end: "16:00" },
      friday: null,
      saturday: { start: "09:00", end: "13:00" },
      sunday: null,
    },
  },
];

export function getGroomerById(id: string): Groomer | undefined {
  return groomers.find((g) => g.id === id);
}

export function getActiveGroomers(): Groomer[] {
  return groomers.filter((g) => g.isActive);
}

export function getMobileGroomers(): Groomer[] {
  return groomers.filter((g) => g.isActive && g.isMobile);
}
