"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Save,
  Trash2,
  User,
  Clock,
  Award,
  MapPin,
} from "lucide-react";
import {
  groomers,
  services,
  type Groomer,
} from "@/lib/mock-data";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const specialties = [
  "Small Dogs",
  "Large Dogs",
  "Cats",
  "Puppies",
  "Senior Pets",
  "Anxious Pets",
  "Double Coats",
  "Hand Stripping",
  "Creative Grooming",
  "Show Cuts",
];

export default function EditTeamMemberPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const groomer = groomers.find((g) => g.id === params.id);

  const [formData, setFormData] = React.useState({
    firstName: groomer?.firstName || "",
    lastName: groomer?.lastName || "",
    email: groomer?.email || "",
    phone: groomer?.phone || "",
    role: "groomer",
    bio: groomer?.bio || "",
    isActive: groomer?.isActive ?? true,
    isMobile: groomer?.isMobile ?? false,
    specialties: groomer?.specialties || [],
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    startTime: "09:00",
    endTime: "17:00",
    commissionRate: 50,
  });

  const [isSaving, setIsSaving] = React.useState(false);

  if (!groomer) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Team member not found</p>
          <Button asChild>
            <Link href="/team">Back to Team</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Team member updated",
      description: "Changes have been saved successfully.",
    });

    setIsSaving(false);
    router.push(`/team/${params.id}`);
  };

  const toggleSpecialty = (specialty: string) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter((s) => s !== specialty)
        : [...prev.specialties, specialty],
    }));
  };

  const toggleWorkingDay = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day],
    }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Edit ${groomer.firstName} ${groomer.lastName}`}
        description="Update team member information and settings"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href={`/team/${params.id}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Cancel
              </Link>
            </Button>
            <Button onClick={handleSubmit} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Personal details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, firstName: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, lastName: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, role: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="groomer">Groomer</SelectItem>
                  <SelectItem value="senior_groomer">Senior Groomer</SelectItem>
                  <SelectItem value="bather">Bather</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, bio: e.target.value }))
                }
                placeholder="Short bio or description..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Work Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Work Settings
            </CardTitle>
            <CardDescription>
              Schedule, availability, and work preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Active Status</p>
                <p className="text-sm text-muted-foreground">
                  Inactive members won&apos;t appear in scheduling
                </p>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isActive: checked }))
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Mobile Groomer</p>
                <p className="text-sm text-muted-foreground">
                  This team member does mobile/house call appointments
                </p>
              </div>
              <Switch
                checked={formData.isMobile}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isMobile: checked }))
                }
              />
            </div>
            <Separator />
            <div className="space-y-3">
              <Label>Working Days</Label>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map((day) => (
                  <Badge
                    key={day}
                    variant={formData.workingDays.includes(day) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleWorkingDay(day)}
                  >
                    {day.slice(0, 3)}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Select
                  value={formData.startTime}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, startTime: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 6).map((hour) => (
                      <SelectItem key={hour} value={`${hour.toString().padStart(2, "0")}:00`}>
                        {hour > 12 ? `${hour - 12}:00 PM` : hour === 12 ? "12:00 PM" : `${hour}:00 AM`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Select
                  value={formData.endTime}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, endTime: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 12).map((hour) => (
                      <SelectItem key={hour} value={`${hour.toString().padStart(2, "0")}:00`}>
                        {hour > 12 ? `${hour - 12}:00 PM` : "12:00 PM"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Specialties */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Specialties & Skills
            </CardTitle>
            <CardDescription>
              Areas of expertise for better appointment matching
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {specialties.map((specialty) => (
                <Badge
                  key={specialty}
                  variant={formData.specialties.includes(specialty) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleSpecialty(specialty)}
                >
                  {specialty}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Commission Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Commission Settings</CardTitle>
            <CardDescription>
              Payment and commission structure
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="commissionRate">Commission Rate (%)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="commissionRate"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.commissionRate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      commissionRate: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="w-24"
                />
                <span className="text-muted-foreground">% of service revenue</span>
              </div>
              <p className="text-xs text-muted-foreground">
                This team member will earn {formData.commissionRate}% of the service price for each appointment.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible actions for this team member
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Remove Team Member</p>
                <p className="text-sm text-muted-foreground">
                  Permanently remove this person from your team
                </p>
              </div>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Remove
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
