"use client";

import * as React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, formatCurrency, formatDate, getInitials } from "@/lib/utils";
import {
  Plus,
  MoreHorizontal,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Star,
  Clock,
  Award,
  Edit,
  Trash2,
  Eye,
  Users,
  TrendingUp,
  Save,
  X,
  Loader2,
} from "lucide-react";
import {
  groomers,
  appointments,
  type Groomer,
} from "@/lib/mock-data";

export default function TeamPage() {
  const [groomerList, setGroomerList] = React.useState(groomers);
  const [editingGroomer, setEditingGroomer] = React.useState<Groomer | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [viewingGroomer, setViewingGroomer] = React.useState<Groomer | null>(null);

  const activeGroomers = groomerList.filter((g) => g.isActive);
  const mobileGroomers = groomerList.filter((g) => g.isMobile);

  // Calculate team stats
  const totalAppointmentsCompleted = appointments.filter(
    (a) => a.status === "completed"
  ).length;
  const totalRevenue = appointments
    .filter((a) => a.status === "completed")
    .reduce((sum, a) => sum + a.totalPrice, 0);

  const handleSaveGroomer = (groomer: Groomer) => {
    if (editingGroomer) {
      setGroomerList((prev) =>
        prev.map((g) => (g.id === groomer.id ? groomer : g))
      );
      setEditingGroomer(null);
    } else {
      setGroomerList((prev) => [...prev, { ...groomer, id: `grm_${Date.now()}` }]);
      setIsAddDialogOpen(false);
    }
  };

  const handleDeactivate = (groomerId: string) => {
    setGroomerList((prev) =>
      prev.map((g) => (g.id === groomerId ? { ...g, isActive: false } : g))
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team"
        description="Manage your grooming team"
        actions={
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Team Member
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-2xl font-bold">{activeGroomers.length}</div>
                <p className="text-xs text-muted-foreground">Active Groomers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-2xl font-bold">{mobileGroomers.length}</div>
                <p className="text-xs text-muted-foreground">Mobile Groomers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-2xl font-bold">{totalAppointmentsCompleted}</div>
                <p className="text-xs text-muted-foreground">Completed Jobs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                <p className="text-xs text-muted-foreground">Team Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groomerList.map((groomer) => (
          <GroomerCard
            key={groomer.id}
            groomer={groomer}
            onEdit={() => setEditingGroomer(groomer)}
            onView={() => setViewingGroomer(groomer)}
            onDeactivate={() => handleDeactivate(groomer.id)}
          />
        ))}
      </div>

      {/* Add Team Member Dialog */}
      <TeamMemberDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={handleSaveGroomer}
      />

      {/* Edit Team Member Dialog */}
      <TeamMemberDialog
        groomer={editingGroomer}
        open={!!editingGroomer}
        onOpenChange={(open) => !open && setEditingGroomer(null)}
        onSave={handleSaveGroomer}
      />

      {/* View Team Member Dialog */}
      <TeamMemberViewDialog
        groomer={viewingGroomer}
        open={!!viewingGroomer}
        onOpenChange={(open) => !open && setViewingGroomer(null)}
      />
    </div>
  );
}

function GroomerCard({
  groomer,
  onEdit,
  onView,
  onDeactivate,
}: {
  groomer: Groomer;
  onEdit: () => void;
  onView: () => void;
  onDeactivate: () => void;
}) {
  const groomerAppointments = appointments.filter(
    (a) => a.groomerId === groomer.id && a.status === "completed"
  );
  const revenue = groomerAppointments.reduce((sum, a) => sum + a.totalPrice, 0);
  const appointmentCount = groomerAppointments.length;

  // Mock rating
  const rating = 4.5 + Math.random() * 0.5;

  return (
    <Card className={cn(!groomer.isActive && "opacity-60")}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={groomer.imageUrl} />
              <AvatarFallback
                className="text-lg"
                style={{ backgroundColor: groomer.color, color: "white" }}
              >
                {getInitials(`${groomer.firstName} ${groomer.lastName}`)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">
                {groomer.firstName} {groomer.lastName}
              </h3>
              <div className="flex items-center gap-2">
                {groomer.isActive ? (
                  <Badge variant="default" className="bg-green-100 text-green-700">
                    Active
                  </Badge>
                ) : (
                  <Badge variant="secondary">Inactive</Badge>
                )}
                {groomer.isMobile && (
                  <Badge variant="outline">
                    <MapPin className="h-3 w-3 mr-1" />
                    Mobile
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onView}>
                <Eye className="h-4 w-4 mr-2" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Calendar className="h-4 w-4 mr-2" />
                View Schedule
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={onDeactivate}>
                <Trash2 className="h-4 w-4 mr-2" />
                Deactivate
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Contact */}
        <div className="flex items-center gap-4 text-sm">
          <a
            href={`mailto:${groomer.email}`}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            <Mail className="h-4 w-4" />
            Email
          </a>
          <a
            href={`tel:${groomer.phone}`}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            <Phone className="h-4 w-4" />
            Call
          </a>
        </div>

        {/* Specialties */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">Specialties</p>
          <div className="flex flex-wrap gap-1">
            {groomer.specialties.slice(0, 3).map((specialty, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {specialty}
              </Badge>
            ))}
            {groomer.specialties.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{groomer.specialties.length - 3}
              </Badge>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-lg font-semibold">{appointmentCount}</p>
            <p className="text-xs text-muted-foreground">Jobs</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold">{formatCurrency(revenue)}</p>
            <p className="text-xs text-muted-foreground">Revenue</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-lg font-semibold">{rating.toFixed(1)}</span>
            </div>
            <p className="text-xs text-muted-foreground">Rating</p>
          </div>
        </div>

        {/* Certifications */}
        {groomer.certifications.length > 0 && (
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground mb-2">Certifications</p>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              <span className="text-sm">
                {groomer.certifications.slice(0, 2).join(", ")}
                {groomer.certifications.length > 2 &&
                  ` +${groomer.certifications.length - 2} more`}
              </span>
            </div>
          </div>
        )}

        {/* Hire Date */}
        <div className="pt-4 border-t flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Joined {formatDate(groomer.hireDate)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

// Team Member Add/Edit Dialog
function TeamMemberDialog({
  groomer,
  open,
  onOpenChange,
  onSave,
}: {
  groomer?: Groomer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (groomer: Groomer) => void;
}) {
  const isEditing = !!groomer;
  const [isLoading, setIsLoading] = React.useState(false);
  const [formData, setFormData] = React.useState<Partial<Groomer>>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    color: "#E07850",
    specialties: [],
    certifications: [],
    isMobile: false,
    isActive: true,
    hireDate: new Date().toISOString(),
  });
  const [newSpecialty, setNewSpecialty] = React.useState("");
  const [newCertification, setNewCertification] = React.useState("");

  React.useEffect(() => {
    if (groomer) {
      setFormData(groomer);
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        color: "#E07850",
        specialties: [],
        certifications: [],
        isMobile: false,
        isActive: true,
        hireDate: new Date().toISOString(),
      });
    }
  }, [groomer, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    onSave(formData as Groomer);
    setIsLoading(false);
  };

  const addSpecialty = () => {
    if (newSpecialty.trim()) {
      setFormData((prev) => ({
        ...prev,
        specialties: [...(prev.specialties || []), newSpecialty.trim()],
      }));
      setNewSpecialty("");
    }
  };

  const removeSpecialty = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties?.filter((_, i) => i !== index) || [],
    }));
  };

  const addCertification = () => {
    if (newCertification.trim()) {
      setFormData((prev) => ({
        ...prev,
        certifications: [...(prev.certifications || []), newCertification.trim()],
      }));
      setNewCertification("");
    }
  };

  const removeCertification = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications?.filter((_, i) => i !== index) || [],
    }));
  };

  const colorOptions = [
    "#E07850", "#5A8A6E", "#E6A332", "#6366F1", "#EC4899", "#8B5CF6",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Team Member" : "Add Team Member"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update team member details" : "Add a new groomer to your team"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                  placeholder="First name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Last name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="email@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="(555) 123-4567"
                  required
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Color Selection */}
          <div className="space-y-2">
            <Label>Calendar Color</Label>
            <p className="text-sm text-muted-foreground">
              This color will be used on the calendar to identify this team member
            </p>
            <div className="flex gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, color }))}
                  className={cn(
                    "h-8 w-8 rounded-full border-2 transition-all",
                    formData.color === color ? "border-foreground scale-110" : "border-transparent"
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <Separator />

          {/* Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Mobile Groomer</p>
                <p className="text-sm text-muted-foreground">
                  This groomer travels to client locations
                </p>
              </div>
              <Switch
                checked={formData.isMobile}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isMobile: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Active</p>
                <p className="text-sm text-muted-foreground">
                  Inactive members cannot be assigned appointments
                </p>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isActive: checked }))
                }
              />
            </div>
          </div>

          <Separator />

          {/* Specialties */}
          <div className="space-y-2">
            <Label>Specialties</Label>
            <div className="flex gap-2">
              <Input
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                placeholder="e.g., Large Dogs, Hand Stripping"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSpecialty())}
              />
              <Button type="button" variant="outline" onClick={addSpecialty}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.specialties?.map((specialty, i) => (
                <Badge key={i} variant="secondary" className="gap-1">
                  {specialty}
                  <button type="button" onClick={() => removeSpecialty(i)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Certifications */}
          <div className="space-y-2">
            <Label>Certifications</Label>
            <div className="flex gap-2">
              <Input
                value={newCertification}
                onChange={(e) => setNewCertification(e.target.value)}
                placeholder="e.g., NDGAA Certified, CPR Certified"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCertification())}
              />
              <Button type="button" variant="outline" onClick={addCertification}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.certifications?.map((cert, i) => (
                <Badge key={i} variant="outline" className="gap-1">
                  <Award className="h-3 w-3" />
                  {cert}
                  <button type="button" onClick={() => removeCertification(i)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isEditing ? "Update Member" : "Add Member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Team Member View Dialog
function TeamMemberViewDialog({
  groomer,
  open,
  onOpenChange,
}: {
  groomer: Groomer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!groomer) return null;

  const groomerAppointments = appointments.filter(
    (a) => a.groomerId === groomer.id && a.status === "completed"
  );
  const revenue = groomerAppointments.reduce((sum, a) => sum + a.totalPrice, 0);
  const appointmentCount = groomerAppointments.length;
  const rating = 4.5 + Math.random() * 0.5;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="items-center text-center">
          <Avatar className="h-20 w-20 mb-2">
            <AvatarImage src={groomer.imageUrl} />
            <AvatarFallback
              className="text-2xl"
              style={{ backgroundColor: groomer.color, color: "white" }}
            >
              {getInitials(`${groomer.firstName} ${groomer.lastName}`)}
            </AvatarFallback>
          </Avatar>
          <DialogTitle className="text-xl">
            {groomer.firstName} {groomer.lastName}
          </DialogTitle>
          <div className="flex items-center justify-center gap-2">
            {groomer.isActive ? (
              <Badge variant="default" className="bg-green-100 text-green-700">
                Active
              </Badge>
            ) : (
              <Badge variant="secondary">Inactive</Badge>
            )}
            {groomer.isMobile && (
              <Badge variant="outline">
                <MapPin className="h-3 w-3 mr-1" />
                Mobile
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contact Info */}
          <div className="space-y-3">
            <h4 className="font-semibold">Contact Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${groomer.email}`} className="hover:underline">
                  {groomer.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href={`tel:${groomer.phone}`} className="hover:underline">
                  {groomer.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Joined {formatDate(groomer.hireDate)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{appointmentCount}</p>
              <p className="text-xs text-muted-foreground">Completed Jobs</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{formatCurrency(revenue)}</p>
              <p className="text-xs text-muted-foreground">Revenue</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <span className="text-2xl font-bold">{rating.toFixed(1)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Rating</p>
            </div>
          </div>

          <Separator />

          {/* Specialties */}
          {groomer.specialties.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold">Specialties</h4>
              <div className="flex flex-wrap gap-2">
                {groomer.specialties.map((specialty, i) => (
                  <Badge key={i} variant="secondary">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {groomer.certifications.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold">Certifications</h4>
              <div className="flex flex-wrap gap-2">
                {groomer.certifications.map((cert, i) => (
                  <Badge key={i} variant="outline">
                    <Award className="h-3 w-3 mr-1" />
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
