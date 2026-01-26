"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/forms/image-upload";
import { FormSection, FormRow } from "@/components/forms/form-section";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Save,
  Loader2,
  Plus,
  Dog,
  Cat,
  AlertTriangle,
  Shield,
  Syringe,
  X,
  Calendar,
  Scissors,
} from "lucide-react";
import { clients, getClientById } from "@/lib/mock-data";

const dogBreeds = [
  "Golden Retriever", "Labrador Retriever", "Poodle", "German Shepherd",
  "Bulldog", "Beagle", "Yorkshire Terrier", "Boxer", "Dachshund",
  "Shih Tzu", "Siberian Husky", "Cavalier King Charles", "Mixed Breed", "Other"
];

const catBreeds = [
  "Persian", "Maine Coon", "Siamese", "British Shorthair", "Ragdoll",
  "Bengal", "Abyssinian", "Scottish Fold", "Sphynx", "Mixed Breed", "Other"
];

const safetyFlagOptions = [
  { id: "bite_risk", label: "Bite Risk", severity: "high", description: "May bite when stressed" },
  { id: "muzzle_required", label: "Muzzle Required", severity: "high", description: "Requires muzzle for nail trims" },
  { id: "two_handlers", label: "Two Handlers Needed", severity: "medium", description: "Needs extra support" },
  { id: "fear_aggressive", label: "Fear Aggressive", severity: "high", description: "Aggressive when scared" },
  { id: "noise_sensitive", label: "Noise Sensitive", severity: "low", description: "Sensitive to dryers/clippers" },
  { id: "elderly", label: "Elderly/Fragile", severity: "medium", description: "Handle with extra care" },
  { id: "medical_condition", label: "Medical Condition", severity: "medium", description: "Has health issues" },
];

const vaccinationTypes = [
  { id: "rabies", name: "Rabies", required: true },
  { id: "dhpp", name: "DHPP/DHLPP", required: false },
  { id: "bordetella", name: "Bordetella", required: true },
  { id: "leptospirosis", name: "Leptospirosis", required: false },
  { id: "lyme", name: "Lyme Disease", required: false },
  { id: "fvrcp", name: "FVRCP (cats)", required: false },
  { id: "felv", name: "FeLV (cats)", required: false },
];

interface Vaccination {
  id: string;
  type: string;
  expirationDate: string;
}

export default function NewPetPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const preselectedClientId = searchParams.get("client");
  const preselectedClient = preselectedClientId
    ? getClientById(preselectedClientId)
    : null;

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Form state
  const [formData, setFormData] = React.useState({
    clientId: preselectedClientId || "",
    name: "",
    species: "dog" as "dog" | "cat",
    breed: "",
    customBreed: "",
    gender: "male" as "male" | "female" | "unknown",
    dateOfBirth: "",
    weight: "",
    color: "",
    microchipId: "",
    photo: "",
    groomingNotes: "",
    preferredGroomer: "",
    preferredStyle: "",
  });

  const [safetyFlags, setSafetyFlags] = React.useState<string[]>([]);
  const [vaccinations, setVaccinations] = React.useState<Vaccination[]>([]);

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSafetyFlag = (flagId: string) => {
    setSafetyFlags((prev) =>
      prev.includes(flagId)
        ? prev.filter((id) => id !== flagId)
        : [...prev, flagId]
    );
  };

  const addVaccination = () => {
    setVaccinations((prev) => [
      ...prev,
      { id: crypto.randomUUID(), type: "", expirationDate: "" },
    ]);
  };

  const updateVaccination = (id: string, field: string, value: string) => {
    setVaccinations((prev) =>
      prev.map((vax) => (vax.id === id ? { ...vax, [field]: value } : vax))
    );
  };

  const removeVaccination = (id: string) => {
    setVaccinations((prev) => prev.filter((vax) => vax.id !== id));
  };

  const breeds = formData.species === "dog" ? dogBreeds : catBreeds;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Pet added",
      description: `${formData.name} has been added successfully.`,
    });

    if (preselectedClientId) {
      router.push(`/clients/${preselectedClientId}`);
    } else {
      router.push("/pets");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={preselectedClientId ? `/clients/${preselectedClientId}` : "/pets"}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <PageHeader
          title="Add New Pet"
          description={
            preselectedClient
              ? `Adding pet for ${preselectedClient.firstName} ${preselectedClient.lastName}`
              : "Add a new pet to your records"
          }
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Owner Selection */}
            {!preselectedClient && (
              <Card>
                <CardHeader>
                  <CardTitle>Owner</CardTitle>
                  <CardDescription>Select the pet&apos;s owner</CardDescription>
                </CardHeader>
                <CardContent>
                  <Select
                    value={formData.clientId}
                    onValueChange={(value) => updateFormData("clientId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.firstName} {client.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            )}

            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Pet Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Species toggle */}
                <div className="space-y-2">
                  <Label>Species *</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={formData.species === "dog" ? "default" : "outline"}
                      onClick={() => updateFormData("species", "dog")}
                    >
                      <Dog className="h-4 w-4 mr-2" />
                      Dog
                    </Button>
                    <Button
                      type="button"
                      variant={formData.species === "cat" ? "default" : "outline"}
                      onClick={() => updateFormData("species", "cat")}
                    >
                      <Cat className="h-4 w-4 mr-2" />
                      Cat
                    </Button>
                  </div>
                </div>

                <FormRow>
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      placeholder="Max"
                      value={formData.name}
                      onChange={(e) => updateFormData("name", e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="breed">Breed *</Label>
                    <Select
                      value={formData.breed}
                      onValueChange={(value) => updateFormData("breed", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select breed" />
                      </SelectTrigger>
                      <SelectContent>
                        {breeds.map((breed) => (
                          <SelectItem key={breed} value={breed}>
                            {breed}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </FormRow>

                {formData.breed === "Other" && (
                  <div className="space-y-2">
                    <Label htmlFor="customBreed">Specify breed</Label>
                    <Input
                      id="customBreed"
                      placeholder="Enter breed"
                      value={formData.customBreed}
                      onChange={(e) => updateFormData("customBreed", e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                )}

                <FormRow>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => updateFormData("gender", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="unknown">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                </FormRow>

                <FormRow>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (lbs)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="65"
                      value={formData.weight}
                      onChange={(e) => updateFormData("weight", e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color">Color/Markings</Label>
                    <Input
                      id="color"
                      placeholder="Golden, white chest"
                      value={formData.color}
                      onChange={(e) => updateFormData("color", e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                </FormRow>

                <div className="space-y-2">
                  <Label htmlFor="microchipId">Microchip ID</Label>
                  <Input
                    id="microchipId"
                    placeholder="123456789012345"
                    value={formData.microchipId}
                    onChange={(e) => updateFormData("microchipId", e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Safety Flags */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Safety Information
                </CardTitle>
                <CardDescription>
                  Select any safety concerns for this pet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {safetyFlagOptions.map((flag) => {
                    const isSelected = safetyFlags.includes(flag.id);
                    return (
                      <button
                        key={flag.id}
                        type="button"
                        onClick={() => toggleSafetyFlag(flag.id)}
                        className={`p-3 rounded-lg border-2 text-left transition-all ${
                          isSelected
                            ? flag.severity === "high"
                              ? "border-destructive bg-destructive/5"
                              : flag.severity === "medium"
                              ? "border-warning bg-warning/5"
                              : "border-primary bg-primary/5"
                            : "border-border hover:border-muted-foreground/50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <AlertTriangle
                            className={`h-4 w-4 ${
                              isSelected
                                ? flag.severity === "high"
                                  ? "text-destructive"
                                  : flag.severity === "medium"
                                  ? "text-warning"
                                  : "text-primary"
                                : "text-muted-foreground"
                            }`}
                          />
                          <span className="font-medium text-sm">{flag.label}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {flag.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Vaccinations */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Syringe className="h-5 w-5" />
                      Vaccination Records
                    </CardTitle>
                    <CardDescription>
                      Track vaccination status and expiration dates
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addVaccination}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </CardHeader>
              {vaccinations.length > 0 && (
                <CardContent className="space-y-3">
                  {vaccinations.map((vax) => (
                    <div
                      key={vax.id}
                      className="flex items-center gap-3 p-3 border rounded-lg"
                    >
                      <Select
                        value={vax.type}
                        onValueChange={(value) =>
                          updateVaccination(vax.id, "type", value)
                        }
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {vaccinationTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex items-center gap-2 flex-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <Input
                          type="date"
                          value={vax.expirationDate}
                          onChange={(e) =>
                            updateVaccination(vax.id, "expirationDate", e.target.value)
                          }
                          className="flex-1"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeVaccination(vax.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>

            {/* Grooming Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scissors className="h-5 w-5" />
                  Grooming Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="preferredStyle">Preferred Style</Label>
                  <Input
                    id="preferredStyle"
                    placeholder="Puppy cut, 1 inch all over"
                    value={formData.preferredStyle}
                    onChange={(e) => updateFormData("preferredStyle", e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="groomingNotes">Grooming Notes</Label>
                  <Textarea
                    id="groomingNotes"
                    placeholder="Special handling instructions, likes/dislikes, etc."
                    value={formData.groomingNotes}
                    onChange={(e) => updateFormData("groomingNotes", e.target.value)}
                    disabled={isSubmitting}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Photo */}
            <Card>
              <CardHeader>
                <CardTitle>Photo</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  value={formData.photo}
                  onChange={(value) => updateFormData("photo", value)}
                  onRemove={() => updateFormData("photo", "")}
                  disabled={isSubmitting}
                  placeholder="Upload pet photo"
                />
              </CardContent>
            </Card>

            {/* Safety Summary */}
            {safetyFlags.length > 0 && (
              <Card className="border-warning">
                <CardHeader>
                  <CardTitle className="text-warning flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Safety Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {safetyFlags.map((flagId) => {
                      const flag = safetyFlagOptions.find((f) => f.id === flagId);
                      return (
                        <Badge
                          key={flagId}
                          variant={
                            flag?.severity === "high"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {flag?.label}
                        </Badge>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Pet...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Add Pet
                  </>
                )}
              </Button>
              <Link href={preselectedClientId ? `/clients/${preselectedClientId}` : "/pets"}>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
