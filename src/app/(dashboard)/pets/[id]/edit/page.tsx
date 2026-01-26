"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { getPetById, getClientById, groomers, type SafetyFlag } from "@/lib/mock-data";
import {
  ArrowLeft,
  Save,
  Loader2,
  Trash2,
  Dog,
  AlertTriangle,
  Shield,
  Scissors,
  Heart,
  Calendar,
  Upload,
} from "lucide-react";

const dogBreeds = [
  "Golden Retriever", "Labrador Retriever", "Poodle", "German Shepherd",
  "French Bulldog", "Bulldog", "Beagle", "Yorkshire Terrier",
  "Dachshund", "Boxer", "Shih Tzu", "Maltese", "Chihuahua",
  "Great Dane", "Husky", "Corgi", "Border Collie", "Mixed Breed", "Other"
];

const catBreeds = [
  "Persian", "Maine Coon", "Siamese", "Ragdoll", "Bengal",
  "British Shorthair", "Abyssinian", "Scottish Fold", "Sphynx",
  "Russian Blue", "Domestic Shorthair", "Domestic Longhair", "Other"
];

const coatTypes = ["Short", "Medium", "Long", "Double", "Curly", "Wire", "Hairless"];
const sizes = ["Small (0-20 lbs)", "Medium (21-50 lbs)", "Large (51-90 lbs)", "X-Large (90+ lbs)"];

type SafetyFlagType = SafetyFlag["type"];

const safetyFlagOptions: { id: SafetyFlagType; label: string; description: string; icon: string }[] = [
  { id: "bite_risk", label: "Bite Risk", description: "May bite when stressed", icon: "🦷" },
  { id: "behavioral", label: "Behavioral", description: "Behavioral concerns", icon: "😰" },
  { id: "handling", label: "Handling", description: "Requires special handling", icon: "⚠️" },
  { id: "medical", label: "Medical Condition", description: "Has health issues", icon: "💊" },
  { id: "escape_risk", label: "Escape Risk", description: "Tries to escape", icon: "🏃" },
];

export default function EditPetPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const pet = getPetById(params.id);
  const client = pet ? getClientById(pet.clientId) : null;

  const [isLoading, setIsLoading] = React.useState(false);

  // Extract vaccination dates from array
  const getVaccinationDate = (name: string) => {
    const vax = pet?.vaccinations?.find((v) => v.name.toLowerCase() === name.toLowerCase());
    return vax?.expirationDate || "";
  };

  const [formData, setFormData] = React.useState({
    name: pet?.name || "",
    species: pet?.species || "dog" as "dog" | "cat",
    breed: pet?.breed || "",
    color: pet?.color || "",
    dateOfBirth: pet?.dateOfBirth || "",
    weight: pet?.weight?.toString() || "",
    size: pet?.size || "",
    coatType: pet?.coatType || "",
    preferredGroomer: pet?.preferredGroomerId || "",
    preferredStyle: pet?.preferredStyle || "",
    groomingNotes: pet?.groomingNotes || "",
    safetyFlagTypes: pet?.safetyFlags?.map((f) => f.type) || [] as SafetyFlagType[],
    vaccinations: {
      rabies: getVaccinationDate("Rabies"),
      dhpp: getVaccinationDate("DHPP"),
      bordetella: getVaccinationDate("Bordetella"),
    },
  });

  if (!pet || !client) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-semibold">Pet not found</h2>
        <p className="text-muted-foreground mt-2">This pet does not exist or has been removed.</p>
        <Button asChild className="mt-4">
          <Link href="/pets">Back to Pets</Link>
        </Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Pet updated",
      description: `${formData.name}'s profile has been saved.`,
    });

    setIsLoading(false);
    router.push(`/pets/${params.id}`);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    toast({
      title: "Pet archived",
      description: `${pet.name} has been archived.`,
    });

    router.push(`/clients/${client.id}`);
  };

  const toggleSafetyFlag = (flagType: SafetyFlagType) => {
    setFormData((prev) => ({
      ...prev,
      safetyFlagTypes: prev.safetyFlagTypes.includes(flagType)
        ? prev.safetyFlagTypes.filter((f) => f !== flagType)
        : [...prev.safetyFlagTypes, flagType],
    }));
  };

  const breeds = formData.species === "dog" ? dogBreeds : catBreeds;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Pet"
        description={`${pet.name} • ${client.firstName} ${client.lastName}`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/pets/${params.id}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Cancel
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Archive
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Archive {pet.name}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will archive {pet.name}&apos;s profile. You can restore them later
                    from the archived pets list.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Archive Pet
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo */}
        <Card>
          <CardHeader>
            <CardTitle>Pet Photo</CardTitle>
            <CardDescription>Upload a photo to help identify {formData.name || "this pet"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-4xl">
                {formData.species === "dog" ? "🐕" : "🐈"}
              </div>
              <div className="space-y-2">
                <Button variant="outline" type="button">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photo
                </Button>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG or GIF. Max size 2MB.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dog className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Pet Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="species">Species *</Label>
                <Select
                  value={formData.species}
                  onValueChange={(value: "dog" | "cat") =>
                    setFormData((prev) => ({ ...prev, species: value, breed: "" }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dog">Dog</SelectItem>
                    <SelectItem value="cat">Cat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="breed">Breed *</Label>
                <Select
                  value={formData.breed}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, breed: value }))
                  }
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
              <div className="space-y-2">
                <Label htmlFor="color">Color/Markings</Label>
                <Input
                  id="color"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, color: e.target.value }))
                  }
                  placeholder="e.g., Golden, Black & White"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Birth Date</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, dateOfBirth: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (lbs)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, weight: e.target.value }))
                  }
                  placeholder="e.g., 45"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coatType">Coat Type</Label>
                <Select
                  value={formData.coatType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, coatType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select coat type" />
                  </SelectTrigger>
                  <SelectContent>
                    {coatTypes.map((type) => (
                      <SelectItem key={type} value={type.toLowerCase()}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Safety Flags */}
        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="h-5 w-5" />
              Safety Flags
            </CardTitle>
            <CardDescription>
              Important safety information displayed to groomers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {safetyFlagOptions.map((flag) => (
                <div
                  key={flag.id}
                  onClick={() => toggleSafetyFlag(flag.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    formData.safetyFlagTypes.includes(flag.id)
                      ? "bg-amber-100 border-amber-300"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <span className="text-xl">{flag.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{flag.label}</p>
                    <p className="text-xs text-muted-foreground">{flag.description}</p>
                  </div>
                  {formData.safetyFlagTypes.includes(flag.id) && (
                    <Badge variant="secondary" className="bg-amber-200">Active</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Grooming Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scissors className="h-5 w-5" />
              Grooming Preferences
            </CardTitle>
            <CardDescription>
              Styling and handling preferences for this pet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preferredGroomer">Preferred Groomer</Label>
                <Select
                  value={formData.preferredGroomer}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, preferredGroomer: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="No preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No preference</SelectItem>
                    {groomers.map((groomer) => (
                      <SelectItem key={groomer.id} value={groomer.id}>
                        {groomer.firstName} {groomer.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferredStyle">Grooming Style</Label>
                <Input
                  id="preferredStyle"
                  value={formData.preferredStyle}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, preferredStyle: e.target.value }))
                  }
                  placeholder="e.g., Puppy cut, 1 inch all over"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="groomingNotes">Grooming Notes</Label>
              <Textarea
                id="groomingNotes"
                value={formData.groomingNotes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, groomingNotes: e.target.value }))
                }
                placeholder="Special instructions, handling tips, style preferences..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Vaccinations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Vaccination Records
            </CardTitle>
            <CardDescription>
              Keep vaccination expiration dates up to date
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rabies">Rabies Expires</Label>
                <Input
                  id="rabies"
                  type="date"
                  value={formData.vaccinations.rabies}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      vaccinations: { ...prev.vaccinations, rabies: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dhpp">DHPP Expires</Label>
                <Input
                  id="dhpp"
                  type="date"
                  value={formData.vaccinations.dhpp}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      vaccinations: { ...prev.vaccinations, dhpp: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bordetella">Bordetella Expires</Label>
                <Input
                  id="bordetella"
                  type="date"
                  value={formData.vaccinations.bordetella}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      vaccinations: { ...prev.vaccinations, bordetella: e.target.value },
                    }))
                  }
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              You will receive reminders when vaccinations are about to expire.
            </p>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" asChild>
            <Link href={`/pets/${params.id}`}>Cancel</Link>
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
