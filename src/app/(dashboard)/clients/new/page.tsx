"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Bell,
  Trash2,
  Dog,
  Cat,
} from "lucide-react";

interface PetFormData {
  id: string;
  name: string;
  species: "dog" | "cat";
  breed: string;
  weight: string;
}

export default function NewClientPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [addPets, setAddPets] = React.useState(false);

  // Form state
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    altPhone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    notes: "",
    preferredContact: "email",
    sendReminders: true,
    sendPromotions: false,
    avatar: "",
  });

  const [pets, setPets] = React.useState<PetFormData[]>([]);

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addPet = () => {
    setPets((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "",
        species: "dog",
        breed: "",
        weight: "",
      },
    ]);
  };

  const updatePet = (id: string, field: string, value: string) => {
    setPets((prev) =>
      prev.map((pet) => (pet.id === id ? { ...pet, [field]: value } : pet))
    );
  };

  const removePet = (id: string) => {
    setPets((prev) => prev.filter((pet) => pet.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Client created",
      description: `${formData.firstName} ${formData.lastName} has been added to your clients.`,
    });

    router.push("/clients");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/clients">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <PageHeader
          title="New Client"
          description="Add a new client to your business"
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormRow>
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name *</Label>
                    <Input
                      id="firstName"
                      placeholder="Jane"
                      value={formData.firstName}
                      onChange={(e) => updateFormData("firstName", e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name *</Label>
                    <Input
                      id="lastName"
                      placeholder="Smith"
                      value={formData.lastName}
                      onChange={(e) => updateFormData("lastName", e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </FormRow>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormRow>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="jane@example.com"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => updateFormData("phone", e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </FormRow>
                <div className="space-y-2">
                  <Label htmlFor="altPhone">Alternate phone</Label>
                  <Input
                    id="altPhone"
                    type="tel"
                    placeholder="(555) 987-6543"
                    value={formData.altPhone}
                    onChange={(e) => updateFormData("altPhone", e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Address
                </CardTitle>
                <CardDescription>
                  Required for mobile grooming appointments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Street address</Label>
                  <Input
                    id="address"
                    placeholder="123 Main Street"
                    value={formData.address}
                    onChange={(e) => updateFormData("address", e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                <FormRow>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="San Francisco"
                      value={formData.city}
                      onChange={(e) => updateFormData("city", e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        placeholder="CA"
                        value={formData.state}
                        onChange={(e) => updateFormData("state", e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP</Label>
                      <Input
                        id="zipCode"
                        placeholder="94102"
                        value={formData.zipCode}
                        onChange={(e) => updateFormData("zipCode", e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </FormRow>
              </CardContent>
            </Card>

            {/* Add Pets */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Dog className="h-5 w-5" />
                      Pets
                    </CardTitle>
                    <CardDescription>
                      Add pets now or later from the client profile
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addPet}
                    disabled={isSubmitting}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Pet
                  </Button>
                </div>
              </CardHeader>
              {pets.length > 0 && (
                <CardContent className="space-y-4">
                  {pets.map((pet, index) => (
                    <div
                      key={pet.id}
                      className="p-4 border rounded-lg space-y-4 relative"
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removePet(pet.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>

                      <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant={pet.species === "dog" ? "default" : "outline"}
                            size="sm"
                            onClick={() => updatePet(pet.id, "species", "dog")}
                          >
                            <Dog className="h-4 w-4 mr-1" />
                            Dog
                          </Button>
                          <Button
                            type="button"
                            variant={pet.species === "cat" ? "default" : "outline"}
                            size="sm"
                            onClick={() => updatePet(pet.id, "species", "cat")}
                          >
                            <Cat className="h-4 w-4 mr-1" />
                            Cat
                          </Button>
                        </div>
                      </div>

                      <FormRow>
                        <div className="space-y-2">
                          <Label>Pet name *</Label>
                          <Input
                            placeholder="Max"
                            value={pet.name}
                            onChange={(e) =>
                              updatePet(pet.id, "name", e.target.value)
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Breed</Label>
                          <Input
                            placeholder="Golden Retriever"
                            value={pet.breed}
                            onChange={(e) =>
                              updatePet(pet.id, "breed", e.target.value)
                            }
                          />
                        </div>
                      </FormRow>

                      <div className="w-32">
                        <Label>Weight (lbs)</Label>
                        <Input
                          type="number"
                          placeholder="65"
                          value={pet.weight}
                          onChange={(e) =>
                            updatePet(pet.id, "weight", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Any special instructions, gate codes, parking notes, etc."
                  value={formData.notes}
                  onChange={(e) => updateFormData("notes", e.target.value)}
                  disabled={isSubmitting}
                  rows={4}
                />
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
                  value={formData.avatar}
                  onChange={(value) => updateFormData("avatar", value)}
                  onRemove={() => updateFormData("avatar", "")}
                  disabled={isSubmitting}
                  placeholder="Upload client photo"
                />
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Preferred contact method</Label>
                  <Select
                    value={formData.preferredContact}
                    onValueChange={(value) =>
                      updateFormData("preferredContact", value)
                    }
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone call</SelectItem>
                      <SelectItem value="sms">Text message</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="reminders"
                      checked={formData.sendReminders}
                      onCheckedChange={(checked) =>
                        updateFormData("sendReminders", checked as boolean)
                      }
                    />
                    <Label htmlFor="reminders" className="font-normal cursor-pointer">
                      Send appointment reminders
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="promotions"
                      checked={formData.sendPromotions}
                      onCheckedChange={(checked) =>
                        updateFormData("sendPromotions", checked as boolean)
                      }
                    />
                    <Label htmlFor="promotions" className="font-normal cursor-pointer">
                      Send promotions and updates
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create Client
                  </>
                )}
              </Button>
              <Link href="/clients">
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
