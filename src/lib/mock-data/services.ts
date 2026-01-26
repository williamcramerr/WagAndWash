import { Service } from "./types";

export const services: Service[] = [
  // Full Grooming Services
  {
    id: "svc_1",
    name: "Full Groom",
    description: "Complete grooming package including bath, haircut, nail trim, ear cleaning, and anal gland expression.",
    category: "grooming",
    basePrice: 65,
    baseDuration: 90,
    sizeModifiers: {
      small: { price: 0, duration: 0 },
      medium: { price: 15, duration: 15 },
      large: { price: 30, duration: 30 },
      xlarge: { price: 50, duration: 45 },
    },
    coatModifiers: {
      short: { price: 0, duration: 0 },
      medium: { price: 10, duration: 10 },
      long: { price: 20, duration: 20 },
      double: { price: 25, duration: 25 },
      wire: { price: 15, duration: 15 },
      curly: { price: 20, duration: 20 },
    },
    isActive: true,
    requiresDeposit: true,
    depositAmount: 25,
    sortOrder: 1,
  },
  {
    id: "svc_2",
    name: "Puppy's First Groom",
    description: "Gentle introduction to grooming for puppies under 6 months. Includes bath, light trim, nail trim, and positive reinforcement training.",
    category: "grooming",
    basePrice: 45,
    baseDuration: 60,
    sizeModifiers: {
      small: { price: 0, duration: 0 },
      medium: { price: 10, duration: 10 },
      large: { price: 15, duration: 15 },
      xlarge: { price: 20, duration: 20 },
    },
    isActive: true,
    requiresDeposit: false,
    sortOrder: 2,
  },
  {
    id: "svc_3",
    name: "Breed Standard Cut",
    description: "Professional breed-specific styling following AKC standards.",
    category: "grooming",
    basePrice: 85,
    baseDuration: 120,
    sizeModifiers: {
      small: { price: 0, duration: 0 },
      medium: { price: 20, duration: 20 },
      large: { price: 40, duration: 40 },
      xlarge: { price: 60, duration: 60 },
    },
    isActive: true,
    requiresDeposit: true,
    depositAmount: 40,
    sortOrder: 3,
  },
  // Bath Services
  {
    id: "svc_4",
    name: "Bath & Brush",
    description: "Deep cleansing bath with conditioning, blow dry, brush out, nail trim, and ear cleaning.",
    category: "bath",
    basePrice: 35,
    baseDuration: 45,
    sizeModifiers: {
      small: { price: 0, duration: 0 },
      medium: { price: 10, duration: 10 },
      large: { price: 20, duration: 20 },
      xlarge: { price: 30, duration: 30 },
    },
    coatModifiers: {
      short: { price: 0, duration: 0 },
      medium: { price: 5, duration: 5 },
      long: { price: 15, duration: 15 },
      double: { price: 20, duration: 20 },
      wire: { price: 5, duration: 5 },
      curly: { price: 10, duration: 10 },
    },
    isActive: true,
    requiresDeposit: false,
    sortOrder: 4,
  },
  {
    id: "svc_5",
    name: "De-Shed Treatment",
    description: "Specialized treatment to reduce shedding by up to 80%. Includes de-shedding shampoo, conditioner, and thorough undercoat removal.",
    category: "bath",
    basePrice: 55,
    baseDuration: 75,
    sizeModifiers: {
      small: { price: 0, duration: 0 },
      medium: { price: 15, duration: 15 },
      large: { price: 30, duration: 30 },
      xlarge: { price: 45, duration: 45 },
    },
    isActive: true,
    requiresDeposit: false,
    sortOrder: 5,
  },
  // Specialty Services
  {
    id: "svc_6",
    name: "Hand Stripping",
    description: "Traditional hand stripping technique for wire-coated breeds to maintain proper coat texture.",
    category: "specialty",
    basePrice: 95,
    baseDuration: 150,
    sizeModifiers: {
      small: { price: 0, duration: 0 },
      medium: { price: 25, duration: 30 },
      large: { price: 50, duration: 60 },
      xlarge: { price: 75, duration: 90 },
    },
    isActive: true,
    requiresDeposit: true,
    depositAmount: 50,
    sortOrder: 6,
  },
  {
    id: "svc_7",
    name: "Cat Grooming",
    description: "Full grooming service specifically designed for cats. Includes bath, brush, nail trim, and ear cleaning.",
    category: "specialty",
    basePrice: 70,
    baseDuration: 90,
    sizeModifiers: {
      small: { price: 0, duration: 0 },
      medium: { price: 10, duration: 10 },
      large: { price: 20, duration: 20 },
      xlarge: { price: 30, duration: 30 },
    },
    coatModifiers: {
      short: { price: 0, duration: 0 },
      medium: { price: 10, duration: 10 },
      long: { price: 25, duration: 30 },
    },
    isActive: true,
    requiresDeposit: true,
    depositAmount: 30,
    sortOrder: 7,
  },
  {
    id: "svc_8",
    name: "Medicated Bath",
    description: "Therapeutic bath using veterinary-recommended medicated shampoo for skin conditions.",
    category: "specialty",
    basePrice: 50,
    baseDuration: 60,
    sizeModifiers: {
      small: { price: 0, duration: 0 },
      medium: { price: 10, duration: 10 },
      large: { price: 20, duration: 15 },
      xlarge: { price: 30, duration: 20 },
    },
    isActive: true,
    requiresDeposit: false,
    sortOrder: 8,
  },
  // Add-On Services
  {
    id: "svc_9",
    name: "Nail Trim",
    description: "Professional nail trimming with dremel finishing.",
    category: "add-on",
    basePrice: 15,
    baseDuration: 15,
    sizeModifiers: {
      small: { price: 0, duration: 0 },
      medium: { price: 0, duration: 5 },
      large: { price: 5, duration: 5 },
      xlarge: { price: 5, duration: 10 },
    },
    isActive: true,
    requiresDeposit: false,
    sortOrder: 9,
  },
  {
    id: "svc_10",
    name: "Nail Grinding",
    description: "Smooth nail grinding with professional dremel for a polished finish.",
    category: "add-on",
    basePrice: 18,
    baseDuration: 20,
    sizeModifiers: {
      small: { price: 0, duration: 0 },
      medium: { price: 0, duration: 5 },
      large: { price: 5, duration: 5 },
      xlarge: { price: 5, duration: 10 },
    },
    isActive: true,
    requiresDeposit: false,
    sortOrder: 10,
  },
  {
    id: "svc_11",
    name: "Teeth Brushing",
    description: "Dental hygiene service with enzymatic toothpaste.",
    category: "add-on",
    basePrice: 12,
    baseDuration: 10,
    sizeModifiers: {
      small: { price: 0, duration: 0 },
      medium: { price: 0, duration: 0 },
      large: { price: 0, duration: 5 },
      xlarge: { price: 0, duration: 5 },
    },
    isActive: true,
    requiresDeposit: false,
    sortOrder: 11,
  },
  {
    id: "svc_12",
    name: "Ear Cleaning",
    description: "Deep ear cleaning with medicated solution.",
    category: "add-on",
    basePrice: 10,
    baseDuration: 10,
    sizeModifiers: {
      small: { price: 0, duration: 0 },
      medium: { price: 0, duration: 0 },
      large: { price: 0, duration: 5 },
      xlarge: { price: 0, duration: 5 },
    },
    isActive: true,
    requiresDeposit: false,
    sortOrder: 12,
  },
  {
    id: "svc_13",
    name: "Flea Treatment",
    description: "Flea bath with specialized flea-killing shampoo and thorough combing.",
    category: "add-on",
    basePrice: 25,
    baseDuration: 20,
    sizeModifiers: {
      small: { price: 0, duration: 0 },
      medium: { price: 5, duration: 5 },
      large: { price: 10, duration: 10 },
      xlarge: { price: 15, duration: 15 },
    },
    isActive: true,
    requiresDeposit: false,
    sortOrder: 13,
  },
  {
    id: "svc_14",
    name: "Blueberry Facial",
    description: "Brightening facial treatment for light-colored coats to remove tear stains.",
    category: "add-on",
    basePrice: 15,
    baseDuration: 15,
    sizeModifiers: {
      small: { price: 0, duration: 0 },
      medium: { price: 0, duration: 0 },
      large: { price: 0, duration: 0 },
      xlarge: { price: 0, duration: 0 },
    },
    isActive: true,
    requiresDeposit: false,
    sortOrder: 14,
  },
  {
    id: "svc_15",
    name: "Pawdicure",
    description: "Nail trim with paw pad conditioning and fur trim between toes.",
    category: "add-on",
    basePrice: 20,
    baseDuration: 20,
    sizeModifiers: {
      small: { price: 0, duration: 0 },
      medium: { price: 5, duration: 5 },
      large: { price: 5, duration: 5 },
      xlarge: { price: 10, duration: 10 },
    },
    isActive: true,
    requiresDeposit: false,
    sortOrder: 15,
  },
];

export function getServiceById(id: string): Service | undefined {
  return services.find((s) => s.id === id);
}

export function getActiveServices(): Service[] {
  return services.filter((s) => s.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getServicesByCategory(category: Service["category"]): Service[] {
  return services.filter((s) => s.category === category && s.isActive);
}

export function calculateServicePrice(
  service: Service,
  size: "small" | "medium" | "large" | "xlarge",
  coatType?: "short" | "medium" | "long" | "double" | "wire" | "curly"
): number {
  let price = service.basePrice + service.sizeModifiers[size].price;
  if (coatType && service.coatModifiers?.[coatType]) {
    price += service.coatModifiers[coatType]!.price;
  }
  return price;
}

export function calculateServiceDuration(
  service: Service,
  size: "small" | "medium" | "large" | "xlarge",
  coatType?: "short" | "medium" | "long" | "double" | "wire" | "curly"
): number {
  let duration = service.baseDuration + service.sizeModifiers[size].duration;
  if (coatType && service.coatModifiers?.[coatType]) {
    duration += service.coatModifiers[coatType]!.duration;
  }
  return duration;
}
