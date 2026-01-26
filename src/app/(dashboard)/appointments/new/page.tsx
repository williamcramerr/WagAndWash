"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PetAvatar } from "@/components/ui/pet-avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn, formatCurrency, formatDate, getInitials, calculateAge } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronsUpDown,
  Search,
  User,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  AlertTriangle,
  Scissors,
  CreditCard,
  Plus,
} from "lucide-react";
import { format, addDays, setHours, setMinutes } from "date-fns";
import {
  clients,
  getPetsByClientId,
  getActiveGroomers,
  services,
  getClientById,
  getPetById,
  type Client,
  type Pet,
  type Service,
  type Groomer,
} from "@/lib/mock-data";

type BookingStep = "client" | "pets" | "services" | "datetime" | "confirm";

const steps: { id: BookingStep; title: string; description: string }[] = [
  { id: "client", title: "Select Client", description: "Choose or create a client" },
  { id: "pets", title: "Select Pets", description: "Choose pets for this appointment" },
  { id: "services", title: "Choose Services", description: "Select grooming services" },
  { id: "datetime", title: "Pick Time", description: "Choose date, time & groomer" },
  { id: "confirm", title: "Confirm & Pay", description: "Review and complete booking" },
];

interface SelectedService {
  petId: string;
  serviceId: string;
  price: number;
}

export default function NewAppointmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedClientId = searchParams.get("client");
  const preselectedPetId = searchParams.get("pet");

  const [currentStep, setCurrentStep] = React.useState<BookingStep>("client");
  const [selectedClient, setSelectedClient] = React.useState<Client | null>(
    preselectedClientId ? getClientById(preselectedClientId) || null : null
  );
  const [selectedPetIds, setSelectedPetIds] = React.useState<string[]>(
    preselectedPetId ? [preselectedPetId] : []
  );
  const [selectedServices, setSelectedServices] = React.useState<SelectedService[]>([]);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(addDays(new Date(), 1));
  const [selectedTime, setSelectedTime] = React.useState<string>("10:00");
  const [selectedGroomer, setSelectedGroomer] = React.useState<string>("");
  const [isMobile, setIsMobile] = React.useState(false);
  const [notes, setNotes] = React.useState("");
  const [depositRequired, setDepositRequired] = React.useState(true);

  const groomers = getActiveGroomers();
  const clientPets = selectedClient ? getPetsByClientId(selectedClient.id) : [];

  // Calculate totals
  const subtotal = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const depositAmount = depositRequired ? Math.min(subtotal * 0.25, 50) : 0;

  const canProceed = () => {
    switch (currentStep) {
      case "client":
        return !!selectedClient;
      case "pets":
        return selectedPetIds.length > 0;
      case "services":
        return selectedServices.length > 0;
      case "datetime":
        return !!selectedDate && !!selectedTime && !!selectedGroomer;
      case "confirm":
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    const stepIndex = steps.findIndex((s) => s.id === currentStep);
    if (stepIndex < steps.length - 1) {
      setCurrentStep(steps[stepIndex + 1].id);
    }
  };

  const handleBack = () => {
    const stepIndex = steps.findIndex((s) => s.id === currentStep);
    if (stepIndex > 0) {
      setCurrentStep(steps[stepIndex - 1].id);
    }
  };

  const handleComplete = () => {
    // In a real app, this would create the appointment
    router.push("/appointments");
  };

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">New Appointment</h1>
          <p className="text-muted-foreground">Book a grooming appointment</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div
              className={cn(
                "flex items-center gap-2 cursor-pointer",
                index <= currentStepIndex ? "text-primary" : "text-muted-foreground"
              )}
              onClick={() => index < currentStepIndex && setCurrentStep(step.id)}
            >
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium border-2",
                  index < currentStepIndex
                    ? "bg-primary border-primary text-primary-foreground"
                    : index === currentStepIndex
                    ? "border-primary text-primary"
                    : "border-muted-foreground"
                )}
              >
                {index < currentStepIndex ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{step.title}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2",
                  index < currentStepIndex ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStepIndex].title}</CardTitle>
          <CardDescription>{steps[currentStepIndex].description}</CardDescription>
        </CardHeader>
        <CardContent>
          {currentStep === "client" && (
            <ClientStep
              selectedClient={selectedClient}
              onSelect={(client) => {
                setSelectedClient(client);
                setSelectedPetIds([]);
                setSelectedServices([]);
              }}
            />
          )}

          {currentStep === "pets" && (
            <PetsStep
              pets={clientPets}
              selectedPetIds={selectedPetIds}
              onToggle={(petId) => {
                setSelectedPetIds((prev) =>
                  prev.includes(petId)
                    ? prev.filter((id) => id !== petId)
                    : [...prev, petId]
                );
                // Clear services for removed pets
                setSelectedServices((prev) =>
                  prev.filter((s) => selectedPetIds.includes(s.petId) || s.petId === petId)
                );
              }}
            />
          )}

          {currentStep === "services" && (
            <ServicesStep
              pets={clientPets.filter((p) => selectedPetIds.includes(p.id))}
              selectedServices={selectedServices}
              onServiceChange={setSelectedServices}
            />
          )}

          {currentStep === "datetime" && (
            <DateTimeStep
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              selectedGroomer={selectedGroomer}
              isMobile={isMobile}
              groomers={groomers}
              onDateChange={setSelectedDate}
              onTimeChange={setSelectedTime}
              onGroomerChange={setSelectedGroomer}
              onMobileChange={setIsMobile}
            />
          )}

          {currentStep === "confirm" && (
            <ConfirmStep
              client={selectedClient!}
              pets={clientPets.filter((p) => selectedPetIds.includes(p.id))}
              services={selectedServices}
              date={selectedDate!}
              time={selectedTime}
              groomer={groomers.find((g) => g.id === selectedGroomer)!}
              isMobile={isMobile}
              subtotal={subtotal}
              depositAmount={depositAmount}
              depositRequired={depositRequired}
              notes={notes}
              onNotesChange={setNotes}
              onDepositChange={setDepositRequired}
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
        <div className="flex items-center gap-4">
          {currentStep !== "confirm" && (
            <p className="text-sm text-muted-foreground">
              Step {currentStepIndex + 1} of {steps.length}
            </p>
          )}
          {currentStep === "confirm" ? (
            <Button onClick={handleComplete} disabled={!canProceed()}>
              <CreditCard className="h-4 w-4 mr-2" />
              Complete Booking
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={!canProceed()}>
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Step 1: Client Selection
function ClientStep({
  selectedClient,
  onSelect,
}: {
  selectedClient: Client | null;
  onSelect: (client: Client) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const filteredClients = clients.filter((client) => {
    const query = search.toLowerCase();
    return (
      client.firstName.toLowerCase().includes(query) ||
      client.lastName.toLowerCase().includes(query) ||
      client.email.toLowerCase().includes(query) ||
      client.phone.includes(query)
    );
  });

  return (
    <div className="space-y-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto py-3"
          >
            {selectedClient ? (
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(`${selectedClient.firstName} ${selectedClient.lastName}`)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="font-medium">
                    {selectedClient.firstName} {selectedClient.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">{selectedClient.email}</p>
                </div>
              </div>
            ) : (
              <span className="text-muted-foreground">Search for a client...</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search by name, email, or phone..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>No clients found.</CommandEmpty>
              <CommandGroup>
                {filteredClients.slice(0, 10).map((client) => (
                  <CommandItem
                    key={client.id}
                    value={client.id}
                    onSelect={() => {
                      onSelect(client);
                      setOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {getInitials(`${client.firstName} ${client.lastName}`)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">
                          {client.firstName} {client.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">{client.email}</p>
                      </div>
                      {selectedClient?.id === client.id && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-2">or</p>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Create New Client
        </Button>
      </div>
    </div>
  );
}

// Step 2: Pet Selection
function PetsStep({
  pets,
  selectedPetIds,
  onToggle,
}: {
  pets: Pet[];
  selectedPetIds: string[];
  onToggle: (petId: string) => void;
}) {
  return (
    <div className="space-y-4">
      {pets.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No pets found for this client</p>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Pet
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pets.map((pet) => {
            const isSelected = selectedPetIds.includes(pet.id);
            const hasSafetyFlags = pet.safetyFlags.length > 0;

            return (
              <Card
                key={pet.id}
                className={cn(
                  "cursor-pointer transition-all",
                  isSelected && "ring-2 ring-primary"
                )}
                onClick={() => onToggle(pet.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <PetAvatar
                      name={pet.name}
                      species={pet.species}
                      hasSafetyFlags={hasSafetyFlags}
                      size="lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{pet.name}</h4>
                        <Checkbox checked={isSelected} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {pet.breed} &bull; {calculateAge(pet.dateOfBirth)} years
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {pet.weight} lbs &bull; {pet.coatType} coat
                      </p>
                      {hasSafetyFlags && (
                        <div className="flex items-center gap-1 mt-2 text-destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="text-xs font-medium">
                            {pet.safetyFlags.length} safety flag(s)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Step 3: Service Selection
function ServicesStep({
  pets,
  selectedServices,
  onServiceChange,
}: {
  pets: Pet[];
  selectedServices: SelectedService[];
  onServiceChange: (services: SelectedService[]) => void;
}) {
  const groomingServices = services.filter((s) => s.category === "grooming" || s.category === "bath");
  const addOnServices = services.filter((s) => s.category === "add-on");

  const getServicePrice = (service: Service, pet: Pet) => {
    const sizeModifier = service.sizeModifiers[pet.size];
    return service.basePrice + sizeModifier.price;
  };

  const toggleService = (petId: string, serviceId: string, price: number) => {
    const exists = selectedServices.find(
      (s) => s.petId === petId && s.serviceId === serviceId
    );
    if (exists) {
      onServiceChange(
        selectedServices.filter(
          (s) => !(s.petId === petId && s.serviceId === serviceId)
        )
      );
    } else {
      onServiceChange([...selectedServices, { petId, serviceId, price }]);
    }
  };

  return (
    <div className="space-y-6">
      {pets.map((pet) => (
        <div key={pet.id}>
          <div className="flex items-center gap-3 mb-4">
            <PetAvatar
              name={pet.name}
              species={pet.species}
              hasSafetyFlags={pet.safetyFlags.length > 0}
            />
            <div>
              <h4 className="font-semibold">{pet.name}</h4>
              <p className="text-sm text-muted-foreground">{pet.breed}</p>
            </div>
          </div>

          <div className="space-y-4 pl-12">
            <div>
              <h5 className="text-sm font-medium mb-2">Main Service</h5>
              <RadioGroup
                value={
                  selectedServices.find(
                    (s) =>
                      s.petId === pet.id &&
                      groomingServices.some((gs) => gs.id === s.serviceId)
                  )?.serviceId || ""
                }
                onValueChange={(serviceId) => {
                  // Remove old main service and add new one
                  const filtered = selectedServices.filter(
                    (s) =>
                      !(
                        s.petId === pet.id &&
                        groomingServices.some((gs) => gs.id === s.serviceId)
                      )
                  );
                  const service = groomingServices.find((s) => s.id === serviceId);
                  if (service) {
                    onServiceChange([
                      ...filtered,
                      { petId: pet.id, serviceId, price: getServicePrice(service, pet) },
                    ]);
                  }
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {groomingServices.map((service) => {
                    const price = getServicePrice(service, pet);
                    return (
                      <div key={service.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={service.id} id={`${pet.id}-${service.id}`} />
                        <Label
                          htmlFor={`${pet.id}-${service.id}`}
                          className="flex-1 flex justify-between cursor-pointer"
                        >
                          <span>{service.name}</span>
                          <span className="text-muted-foreground">
                            {formatCurrency(price)}
                          </span>
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </RadioGroup>
            </div>

            <div>
              <h5 className="text-sm font-medium mb-2">Add-ons</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {addOnServices.map((service) => {
                  const isSelected = selectedServices.some(
                    (s) => s.petId === pet.id && s.serviceId === service.id
                  );
                  return (
                    <div key={service.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${pet.id}-${service.id}-addon`}
                        checked={isSelected}
                        onCheckedChange={() =>
                          toggleService(pet.id, service.id, service.basePrice)
                        }
                      />
                      <Label
                        htmlFor={`${pet.id}-${service.id}-addon`}
                        className="flex-1 flex justify-between cursor-pointer"
                      >
                        <span>{service.name}</span>
                        <span className="text-muted-foreground">
                          +{formatCurrency(service.basePrice)}
                        </span>
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {pets.indexOf(pet) < pets.length - 1 && <Separator className="my-6" />}
        </div>
      ))}

      {/* Total */}
      <div className="flex justify-end pt-4 border-t">
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Subtotal</p>
          <p className="text-2xl font-bold">
            {formatCurrency(selectedServices.reduce((sum, s) => sum + s.price, 0))}
          </p>
        </div>
      </div>
    </div>
  );
}

// Step 4: Date & Time Selection
function DateTimeStep({
  selectedDate,
  selectedTime,
  selectedGroomer,
  isMobile,
  groomers,
  onDateChange,
  onTimeChange,
  onGroomerChange,
  onMobileChange,
}: {
  selectedDate: Date | undefined;
  selectedTime: string;
  selectedGroomer: string;
  isMobile: boolean;
  groomers: Groomer[];
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (time: string) => void;
  onGroomerChange: (groomerId: string) => void;
  onMobileChange: (isMobile: boolean) => void;
}) {
  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <Label className="mb-2 block">Select Date</Label>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateChange}
            disabled={(date) => date < new Date()}
            className="rounded-md border"
          />
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="mb-2 block">Select Time</Label>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((time) => {
              const hour = parseInt(time.split(":")[0]);
              const displayTime =
                hour > 12
                  ? `${hour - 12}:${time.split(":")[1]} PM`
                  : hour === 12
                  ? `12:${time.split(":")[1]} PM`
                  : `${hour}:${time.split(":")[1]} AM`;
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

        <div>
          <Label className="mb-2 block">Select Groomer</Label>
          <Select value={selectedGroomer} onValueChange={onGroomerChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a groomer" />
            </SelectTrigger>
            <SelectContent>
              {groomers.map((groomer) => (
                <SelectItem key={groomer.id} value={groomer.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: groomer.color }}
                    />
                    {groomer.firstName} {groomer.lastName}
                    {groomer.isMobile && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        Mobile
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="mobile"
            checked={isMobile}
            onCheckedChange={(checked) => onMobileChange(checked as boolean)}
          />
          <Label htmlFor="mobile" className="flex items-center gap-2 cursor-pointer">
            <MapPin className="h-4 w-4" />
            Mobile grooming (at client&apos;s location)
          </Label>
        </div>
      </div>
    </div>
  );
}

// Step 5: Confirmation
function ConfirmStep({
  client,
  pets,
  services,
  date,
  time,
  groomer,
  isMobile,
  subtotal,
  depositAmount,
  depositRequired,
  notes,
  onNotesChange,
  onDepositChange,
}: {
  client: Client;
  pets: Pet[];
  services: SelectedService[];
  date: Date;
  time: string;
  groomer: Groomer;
  isMobile: boolean;
  subtotal: number;
  depositAmount: number;
  depositRequired: boolean;
  notes: string;
  onNotesChange: (notes: string) => void;
  onDepositChange: (required: boolean) => void;
}) {
  const hour = parseInt(time.split(":")[0]);
  const minute = parseInt(time.split(":")[1]);
  const appointmentTime = setMinutes(setHours(date, hour), minute);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Client</h4>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getInitials(`${client.firstName} ${client.lastName}`)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">
                  {client.firstName} {client.lastName}
                </p>
                <p className="text-sm text-muted-foreground">{client.phone}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Date & Time</h4>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span>{format(appointmentTime, "EEEE, MMMM d, yyyy 'at' h:mm a")}</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Groomer</h4>
            <div className="flex items-center gap-2">
              <div
                className="h-6 w-6 rounded-full flex items-center justify-center text-white text-xs"
                style={{ backgroundColor: groomer.color }}
              >
                {groomer.firstName[0]}
              </div>
              <span>
                {groomer.firstName} {groomer.lastName}
              </span>
              {isMobile && (
                <Badge variant="outline">
                  <MapPin className="h-3 w-3 mr-1" />
                  Mobile
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Services</h4>
            {pets.map((pet) => {
              const petServices = services.filter((s) => s.petId === pet.id);
              return (
                <div key={pet.id} className="mb-3">
                  <p className="font-medium text-sm">{pet.name}</p>
                  {petServices.map((svc) => {
                    const service = services.find((s) => s.serviceId === svc.serviceId);
                    const serviceInfo = services.find((s) => s.serviceId === svc.serviceId);
                    return (
                      <div
                        key={svc.serviceId}
                        className="flex justify-between text-sm text-muted-foreground"
                      >
                        <span>
                          {
                            // @ts-ignore - we know this exists
                            services.find((s) => s.serviceId === svc.serviceId)?.serviceId
                          }
                        </span>
                        <span>{formatCurrency(svc.price)}</span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Separator />

      {/* Notes */}
      <div>
        <Label htmlFor="notes">Appointment Notes (optional)</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Any special instructions or notes..."
          rows={3}
          className="mt-2"
        />
      </div>

      {/* Pricing */}
      <div className="bg-muted/50 rounded-lg p-4 space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              id="deposit"
              checked={depositRequired}
              onCheckedChange={(checked) => onDepositChange(checked as boolean)}
            />
            <Label htmlFor="deposit" className="cursor-pointer">
              Require deposit
            </Label>
          </div>
          <span>{depositRequired ? formatCurrency(depositAmount) : formatCurrency(0)}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-bold text-lg">
          <span>Due at appointment</span>
          <span>{formatCurrency(subtotal - depositAmount)}</span>
        </div>
        {depositRequired && (
          <p className="text-sm text-muted-foreground">
            Deposit of {formatCurrency(depositAmount)} due now to confirm booking
          </p>
        )}
      </div>
    </div>
  );
}
