"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, formatCurrency } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Dog,
  Cat,
  Scissors,
  Clock,
  Calendar as CalendarIcon,
  User,
  Phone,
  Mail,
  CreditCard,
  MapPin,
  Sparkles,
  Bath,
  Heart,
} from "lucide-react";
import { format, addDays, setHours, setMinutes } from "date-fns";
import { services, getActiveGroomers } from "@/lib/mock-data";

type BookingStep = "service" | "pet" | "datetime" | "contact" | "confirm";

const steps: { id: BookingStep; title: string }[] = [
  { id: "service", title: "Service" },
  { id: "pet", title: "Pet Info" },
  { id: "datetime", title: "Date & Time" },
  { id: "contact", title: "Contact" },
  { id: "confirm", title: "Confirm" },
];

interface PetInfo {
  name: string;
  species: "dog" | "cat";
  breed: string;
  weight: string;
  age: string;
  notes: string;
}

interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

export default function PublicBookingPage() {
  const [currentStep, setCurrentStep] = React.useState<BookingStep>("service");
  const [selectedService, setSelectedService] = React.useState<string>("");
  const [selectedAddOns, setSelectedAddOns] = React.useState<string[]>([]);
  const [petInfo, setPetInfo] = React.useState<PetInfo>({
    name: "",
    species: "dog",
    breed: "",
    weight: "",
    age: "",
    notes: "",
  });
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(addDays(new Date(), 1));
  const [selectedTime, setSelectedTime] = React.useState<string>("");
  const [isMobile, setIsMobile] = React.useState(false);
  const [contactInfo, setContactInfo] = React.useState<ContactInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const groomers = getActiveGroomers();
  const mainServices = services.filter((s) => s.category === "grooming" || s.category === "bath");
  const addOnServices = services.filter((s) => s.category === "add-on");

  const selectedServiceData = mainServices.find((s) => s.id === selectedService);
  const selectedAddOnData = addOnServices.filter((s) => selectedAddOns.includes(s.id));

  // Calculate price
  const basePrice = selectedServiceData?.basePrice || 0;
  const addOnsPrice = selectedAddOnData.reduce((sum, s) => sum + s.basePrice, 0);
  const totalPrice = basePrice + addOnsPrice;
  const depositAmount = Math.min(totalPrice * 0.25, 50);

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  const canProceed = () => {
    switch (currentStep) {
      case "service":
        return !!selectedService;
      case "pet":
        return petInfo.name && petInfo.breed && petInfo.weight;
      case "datetime":
        return !!selectedDate && !!selectedTime;
      case "contact":
        return (
          contactInfo.firstName &&
          contactInfo.lastName &&
          contactInfo.email &&
          contactInfo.phone
        );
      case "confirm":
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].id);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Book Your Appointment</h1>
        <p className="text-muted-foreground">
          Schedule a grooming session for your furry friend
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div
              className={cn(
                "flex items-center gap-2",
                index <= currentStepIndex ? "text-primary" : "text-muted-foreground"
              )}
            >
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium",
                  index < currentStepIndex
                    ? "bg-primary text-primary-foreground"
                    : index === currentStepIndex
                    ? "border-2 border-primary text-primary"
                    : "border-2 border-muted-foreground"
                )}
              >
                {index < currentStepIndex ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <span className="hidden sm:inline text-sm font-medium">{step.title}</span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "w-8 sm:w-16 h-0.5 mx-2",
                  index < currentStepIndex ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          {currentStep === "service" && (
            <ServiceStep
              mainServices={mainServices}
              addOnServices={addOnServices}
              selectedService={selectedService}
              selectedAddOns={selectedAddOns}
              onServiceChange={setSelectedService}
              onAddOnsChange={setSelectedAddOns}
            />
          )}

          {currentStep === "pet" && (
            <PetStep petInfo={petInfo} onChange={setPetInfo} />
          )}

          {currentStep === "datetime" && (
            <DateTimeStep
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              isMobile={isMobile}
              onDateChange={setSelectedDate}
              onTimeChange={setSelectedTime}
              onMobileChange={setIsMobile}
            />
          )}

          {currentStep === "contact" && (
            <ContactStep
              contactInfo={contactInfo}
              onChange={setContactInfo}
              isMobile={isMobile}
            />
          )}

          {currentStep === "confirm" && (
            <ConfirmStep
              service={selectedServiceData!}
              addOns={selectedAddOnData}
              petInfo={petInfo}
              date={selectedDate!}
              time={selectedTime}
              contactInfo={contactInfo}
              isMobile={isMobile}
              totalPrice={totalPrice}
              depositAmount={depositAmount}
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStepIndex === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {currentStep === "confirm" ? (
          <Button size="lg" disabled={!canProceed()}>
            <CreditCard className="h-4 w-4 mr-2" />
            Pay Deposit ({formatCurrency(depositAmount)})
          </Button>
        ) : (
          <Button onClick={handleNext} disabled={!canProceed()}>
            Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}

// Service Selection Step
function ServiceStep({
  mainServices,
  addOnServices,
  selectedService,
  selectedAddOns,
  onServiceChange,
  onAddOnsChange,
}: {
  mainServices: typeof services;
  addOnServices: typeof services;
  selectedService: string;
  selectedAddOns: string[];
  onServiceChange: (id: string) => void;
  onAddOnsChange: (ids: string[]) => void;
}) {
  const serviceIcons: Record<string, React.ReactNode> = {
    grooming: <Scissors className="h-5 w-5" />,
    bath: <Bath className="h-5 w-5" />,
    specialty: <Sparkles className="h-5 w-5" />,
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Choose a Service</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mainServices.map((service) => (
            <Card
              key={service.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                selectedService === service.id && "ring-2 ring-primary"
              )}
              onClick={() => onServiceChange(service.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    {serviceIcons[service.category] || <Scissors className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{service.name}</h4>
                      <span className="font-bold text-primary">
                        {formatCurrency(service.basePrice)}+
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {service.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      ~{service.baseDuration} min
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {selectedService && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Add-ons (Optional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {addOnServices.map((service) => {
              const isSelected = selectedAddOns.includes(service.id);
              return (
                <div
                  key={service.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                    isSelected ? "border-primary bg-primary/5" : "hover:border-primary/50"
                  )}
                  onClick={() =>
                    onAddOnsChange(
                      isSelected
                        ? selectedAddOns.filter((id) => id !== service.id)
                        : [...selectedAddOns, service.id]
                    )
                  }
                >
                  <Checkbox checked={isSelected} />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{service.name}</p>
                  </div>
                  <span className="text-sm font-medium">
                    +{formatCurrency(service.basePrice)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Pet Info Step
function PetStep({
  petInfo,
  onChange,
}: {
  petInfo: PetInfo;
  onChange: (info: PetInfo) => void;
}) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Tell us about your pet</h3>

      <div className="space-y-4">
        <div>
          <Label className="mb-3 block">Pet Type</Label>
          <RadioGroup
            value={petInfo.species}
            onValueChange={(v) => onChange({ ...petInfo, species: v as "dog" | "cat" })}
            className="flex gap-4"
          >
            <div
              className={cn(
                "flex items-center gap-3 p-4 rounded-lg border cursor-pointer flex-1",
                petInfo.species === "dog" && "border-primary bg-primary/5"
              )}
              onClick={() => onChange({ ...petInfo, species: "dog" })}
            >
              <RadioGroupItem value="dog" id="dog" />
              <Dog className="h-6 w-6" />
              <Label htmlFor="dog" className="cursor-pointer font-medium">
                Dog
              </Label>
            </div>
            <div
              className={cn(
                "flex items-center gap-3 p-4 rounded-lg border cursor-pointer flex-1",
                petInfo.species === "cat" && "border-primary bg-primary/5"
              )}
              onClick={() => onChange({ ...petInfo, species: "cat" })}
            >
              <RadioGroupItem value="cat" id="cat" />
              <Cat className="h-6 w-6" />
              <Label htmlFor="cat" className="cursor-pointer font-medium">
                Cat
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="petName">Pet Name *</Label>
            <Input
              id="petName"
              value={petInfo.name}
              onChange={(e) => onChange({ ...petInfo, name: e.target.value })}
              placeholder="e.g., Max"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="breed">Breed *</Label>
            <Input
              id="breed"
              value={petInfo.breed}
              onChange={(e) => onChange({ ...petInfo, breed: e.target.value })}
              placeholder="e.g., Golden Retriever"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (lbs) *</Label>
            <Select
              value={petInfo.weight}
              onValueChange={(v) => onChange({ ...petInfo, weight: v })}
            >
              <SelectTrigger id="weight">
                <SelectValue placeholder="Select weight range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-15">Small (0-15 lbs)</SelectItem>
                <SelectItem value="16-40">Medium (16-40 lbs)</SelectItem>
                <SelectItem value="41-70">Large (41-70 lbs)</SelectItem>
                <SelectItem value="71+">Extra Large (71+ lbs)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Select
              value={petInfo.age}
              onValueChange={(v) => onChange({ ...petInfo, age: v })}
            >
              <SelectTrigger id="age">
                <SelectValue placeholder="Select age" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="puppy">Puppy/Kitten (under 1 year)</SelectItem>
                <SelectItem value="young">Young (1-3 years)</SelectItem>
                <SelectItem value="adult">Adult (4-7 years)</SelectItem>
                <SelectItem value="senior">Senior (8+ years)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Special Notes</Label>
          <Textarea
            id="notes"
            value={petInfo.notes}
            onChange={(e) => onChange({ ...petInfo, notes: e.target.value })}
            placeholder="Anything we should know? (allergies, behavior, preferences)"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}

// Date & Time Step
function DateTimeStep({
  selectedDate,
  selectedTime,
  isMobile,
  onDateChange,
  onTimeChange,
  onMobileChange,
}: {
  selectedDate: Date | undefined;
  selectedTime: string;
  isMobile: boolean;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (time: string) => void;
  onMobileChange: (mobile: boolean) => void;
}) {
  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00",
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Choose your appointment time</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="mb-3 block">Select Date</Label>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateChange}
            disabled={(date) => date < new Date() || date.getDay() === 0}
            className="rounded-md border"
          />
        </div>

        <div className="space-y-4">
          <div>
            <Label className="mb-3 block">Select Time</Label>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((time) => {
                const hour = parseInt(time.split(":")[0]);
                const displayTime =
                  hour > 12 ? `${hour - 12}:${time.split(":")[1]} PM` : `${time} AM`;
                return (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    size="sm"
                    onClick={() => onTimeChange(time)}
                  >
                    {displayTime}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="pt-4">
            <Label className="mb-3 block">Service Location</Label>
            <RadioGroup
              value={isMobile ? "mobile" : "salon"}
              onValueChange={(v) => onMobileChange(v === "mobile")}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2 p-3 rounded-lg border">
                <RadioGroupItem value="salon" id="salon" />
                <Label htmlFor="salon" className="flex-1 cursor-pointer">
                  <span className="font-medium">Visit our salon</span>
                  <p className="text-sm text-muted-foreground">
                    123 Pet Lane, Springfield
                  </p>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg border">
                <RadioGroupItem value="mobile" id="mobile" />
                <Label htmlFor="mobile" className="flex-1 cursor-pointer">
                  <span className="font-medium">Mobile grooming</span>
                  <p className="text-sm text-muted-foreground">
                    We come to you (+$25)
                  </p>
                </Label>
                <Badge variant="secondary">+$25</Badge>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
    </div>
  );
}

// Contact Info Step
function ContactStep({
  contactInfo,
  onChange,
  isMobile,
}: {
  contactInfo: ContactInfo;
  onChange: (info: ContactInfo) => void;
  isMobile: boolean;
}) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Your Contact Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={contactInfo.firstName}
            onChange={(e) => onChange({ ...contactInfo, firstName: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={contactInfo.lastName}
            onChange={(e) => onChange({ ...contactInfo, lastName: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={contactInfo.email}
            onChange={(e) => onChange({ ...contactInfo, email: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            type="tel"
            value={contactInfo.phone}
            onChange={(e) => onChange({ ...contactInfo, phone: e.target.value })}
          />
        </div>
      </div>

      {isMobile && (
        <>
          <Separator />
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Service Address
            </h4>
            <div className="space-y-2">
              <Label htmlFor="address">Street Address *</Label>
              <Input
                id="address"
                value={contactInfo.address}
                onChange={(e) => onChange({ ...contactInfo, address: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={contactInfo.city}
                  onChange={(e) => onChange({ ...contactInfo, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={contactInfo.state}
                  onChange={(e) => onChange({ ...contactInfo, state: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP *</Label>
                <Input
                  id="zip"
                  value={contactInfo.zip}
                  onChange={(e) => onChange({ ...contactInfo, zip: e.target.value })}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Confirmation Step
function ConfirmStep({
  service,
  addOns,
  petInfo,
  date,
  time,
  contactInfo,
  isMobile,
  totalPrice,
  depositAmount,
}: {
  service: (typeof services)[0];
  addOns: (typeof services);
  petInfo: PetInfo;
  date: Date;
  time: string;
  contactInfo: ContactInfo;
  isMobile: boolean;
  totalPrice: number;
  depositAmount: number;
}) {
  const hour = parseInt(time.split(":")[0]);
  const minute = parseInt(time.split(":")[1]);
  const appointmentTime = setMinutes(setHours(date, hour), minute);
  const mobileFee = isMobile ? 25 : 0;
  const finalTotal = totalPrice + mobileFee;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Review Your Booking</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-muted/50">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Appointment
            </h4>
            <p className="font-semibold">
              {format(appointmentTime, "EEEE, MMMM d, yyyy")}
            </p>
            <p className="text-muted-foreground">
              {format(appointmentTime, "h:mm a")}
            </p>
            {isMobile && (
              <Badge variant="outline" className="mt-2">
                <MapPin className="h-3 w-3 mr-1" />
                Mobile Service
              </Badge>
            )}
          </div>

          <div className="p-4 rounded-lg bg-muted/50">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Pet
            </h4>
            <p className="font-semibold">{petInfo.name}</p>
            <p className="text-muted-foreground">
              {petInfo.breed} &bull; {petInfo.weight} lbs
            </p>
          </div>

          <div className="p-4 rounded-lg bg-muted/50">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              Contact
            </h4>
            <p className="font-semibold">
              {contactInfo.firstName} {contactInfo.lastName}
            </p>
            <p className="text-sm text-muted-foreground">{contactInfo.email}</p>
            <p className="text-sm text-muted-foreground">{contactInfo.phone}</p>
          </div>
        </div>

        <div>
          <div className="p-4 rounded-lg border bg-card">
            <h4 className="font-medium mb-4">Order Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>{service.name}</span>
                <span>{formatCurrency(service.basePrice)}</span>
              </div>
              {addOns.map((addon) => (
                <div key={addon.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{addon.name}</span>
                  <span>{formatCurrency(addon.basePrice)}</span>
                </div>
              ))}
              {isMobile && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Mobile Service Fee</span>
                  <span>{formatCurrency(mobileFee)}</span>
                </div>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatCurrency(finalTotal)}</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="p-3 rounded-lg bg-primary/10">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-primary">Deposit Due Now</p>
                  <p className="text-xs text-muted-foreground">
                    Remaining balance due at appointment
                  </p>
                </div>
                <span className="text-xl font-bold text-primary">
                  {formatCurrency(Math.min(depositAmount, finalTotal * 0.25))}
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            By completing this booking, you agree to our cancellation policy.
            Cancellations within 24 hours may forfeit the deposit.
          </p>
        </div>
      </div>
    </div>
  );
}
