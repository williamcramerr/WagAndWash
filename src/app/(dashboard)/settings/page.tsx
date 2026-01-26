"use client";

import * as React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { formatCurrency } from "@/lib/utils";
import { services, type Service } from "@/lib/mock-data";
import {
  Building2,
  Clock,
  Bell,
  CreditCard,
  Palette,
  Globe,
  Shield,
  Users,
  Mail,
  MessageSquare,
  Save,
  Scissors,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  GripVertical,
  DollarSign,
  Timer,
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your business settings and preferences"
      />

      <Tabs defaultValue="business" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7">
          <TabsTrigger value="business">
            <Building2 className="h-4 w-4 mr-2" />
            Business
          </TabsTrigger>
          <TabsTrigger value="services">
            <Scissors className="h-4 w-4 mr-2" />
            Services
          </TabsTrigger>
          <TabsTrigger value="hours">
            <Clock className="h-4 w-4 mr-2" />
            Hours
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="payments">
            <CreditCard className="h-4 w-4 mr-2" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="booking">
            <Globe className="h-4 w-4 mr-2" />
            Booking
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Business Settings */}
        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                Basic information about your grooming business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input id="businessName" defaultValue="Wag & Wash" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="(555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="hello@wagandwash.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" defaultValue="https://wagandwash.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" defaultValue="123 Pet Lane, Springfield, CA 90210" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Business Description</Label>
                <Textarea
                  id="description"
                  rows={3}
                  defaultValue="Premium pet grooming services for dogs and cats. Mobile and salon options available."
                />
              </div>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Settings */}
        <TabsContent value="services" className="space-y-6">
          <ServicesManager />
        </TabsContent>

        {/* Hours Settings */}
        <TabsContent value="hours" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Hours</CardTitle>
              <CardDescription>Set your operating hours for each day</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
                (day) => (
                  <div key={day} className="flex items-center gap-4">
                    <div className="w-28">
                      <span className="font-medium">{day}</span>
                    </div>
                    <Switch defaultChecked={day !== "Sunday"} />
                    <Select defaultValue="09:00">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 7).map((hour) => (
                          <SelectItem key={hour} value={`${hour.toString().padStart(2, "0")}:00`}>
                            {hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-muted-foreground">to</span>
                    <Select defaultValue="18:00">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 12).map((hour) => (
                          <SelectItem key={hour} value={`${hour.toString().padStart(2, "0")}:00`}>
                            {hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )
              )}
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Hours
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Configure email notification settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">New Booking Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified when a new appointment is booked
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Cancellation Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified when an appointment is canceled
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Daily Summary</p>
                  <p className="text-sm text-muted-foreground">
                    Receive a daily summary of appointments
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Payment Receipts</p>
                  <p className="text-sm text-muted-foreground">
                    Get a copy of payment receipts
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Client Notifications</CardTitle>
              <CardDescription>Configure automatic client notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Booking Confirmation</p>
                  <p className="text-sm text-muted-foreground">
                    Send confirmation when appointment is booked
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Appointment Reminder</p>
                  <p className="text-sm text-muted-foreground">
                    Send reminder 24 hours before appointment
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Grooming Complete</p>
                  <p className="text-sm text-muted-foreground">
                    Notify when grooming is complete (pickup ready)
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Rebook Reminder</p>
                  <p className="text-sm text-muted-foreground">
                    Send reminder when pet is due for grooming
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Settings */}
        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>Configure payment options and deposits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Accept Credit Cards</p>
                  <p className="text-sm text-muted-foreground">
                    Accept Visa, Mastercard, Amex via Stripe
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Accept Cash</p>
                  <p className="text-sm text-muted-foreground">
                    Allow cash payments at checkout
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Require Deposits</p>
                  <p className="text-sm text-muted-foreground">
                    Require deposits for new bookings
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="depositAmount">Default Deposit Amount</Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">$</span>
                  <Input
                    id="depositAmount"
                    type="number"
                    defaultValue="25"
                    className="w-24"
                  />
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Tips</p>
                  <p className="text-sm text-muted-foreground">
                    Allow customers to add tips at checkout
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Payment Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Booking Settings */}
        <TabsContent value="booking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Online Booking</CardTitle>
              <CardDescription>Configure your public booking page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable Online Booking</p>
                  <p className="text-sm text-muted-foreground">
                    Allow clients to book online
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label>Booking URL</Label>
                <div className="flex items-center gap-2">
                  <Input
                    defaultValue="https://book.wagandwash.com"
                    readOnly
                    className="bg-muted"
                  />
                  <Button variant="outline">Copy</Button>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="minNotice">Minimum Booking Notice</Label>
                <Select defaultValue="24">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hour</SelectItem>
                    <SelectItem value="2">2 hours</SelectItem>
                    <SelectItem value="4">4 hours</SelectItem>
                    <SelectItem value="24">24 hours</SelectItem>
                    <SelectItem value="48">48 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxAdvance">Maximum Advance Booking</Label>
                <Select defaultValue="30">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">1 week</SelectItem>
                    <SelectItem value="14">2 weeks</SelectItem>
                    <SelectItem value="30">1 month</SelectItem>
                    <SelectItem value="60">2 months</SelectItem>
                    <SelectItem value="90">3 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Booking Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>Manage your account security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <Button>Change Password</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable 2FA</p>
                  <p className="text-sm text-muted-foreground">
                    Require a code from your authenticator app
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Services Manager Component
function ServicesManager() {
  const [serviceList, setServiceList] = React.useState(services);
  const [editingService, setEditingService] = React.useState<Service | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);

  const categories = [
    { id: "grooming", label: "Full Grooming", description: "Complete grooming packages" },
    { id: "bath", label: "Bath Services", description: "Bath and wash services" },
    { id: "specialty", label: "Specialty", description: "Specialized grooming services" },
    { id: "add-on", label: "Add-Ons", description: "Additional services to complement packages" },
  ];

  const getServicesByCategory = (category: string) => {
    return serviceList.filter((s) => s.category === category).sort((a, b) => a.sortOrder - b.sortOrder);
  };

  const toggleServiceActive = (serviceId: string) => {
    setServiceList((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, isActive: !s.isActive } : s))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Service Catalog</h3>
          <p className="text-sm text-muted-foreground">
            Manage your grooming services and pricing
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={["grooming", "bath"]} className="space-y-4">
        {categories.map((category) => {
          const categoryServices = getServicesByCategory(category.id);
          return (
            <AccordionItem key={category.id} value={category.id} className="border rounded-lg">
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{category.label}</span>
                  <Badge variant="secondary">{categoryServices.length}</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                <div className="space-y-2">
                  {categoryServices.map((service) => (
                    <ServiceRow
                      key={service.id}
                      service={service}
                      onEdit={() => setEditingService(service)}
                      onToggle={() => toggleServiceActive(service.id)}
                    />
                  ))}
                  {categoryServices.length === 0 && (
                    <p className="text-sm text-muted-foreground italic py-4 text-center">
                      No services in this category
                    </p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {/* Edit Service Dialog */}
      <ServiceDialog
        service={editingService}
        open={!!editingService}
        onOpenChange={(open) => !open && setEditingService(null)}
        onSave={(updated) => {
          setServiceList((prev) =>
            prev.map((s) => (s.id === updated.id ? updated : s))
          );
          setEditingService(null);
        }}
      />

      {/* Add Service Dialog */}
      <ServiceDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={(newService) => {
          setServiceList((prev) => [...prev, { ...newService, id: `svc_${Date.now()}` }]);
          setIsAddDialogOpen(false);
        }}
      />
    </div>
  );
}

function ServiceRow({
  service,
  onEdit,
  onToggle,
}: {
  service: Service;
  onEdit: () => void;
  onToggle: () => void;
}) {
  return (
    <div
      className={`flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors ${
        !service.isActive ? "opacity-50" : ""
      }`}
    >
      <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">{service.name}</span>
          {service.requiresDeposit && (
            <Badge variant="outline" className="text-xs">
              ${service.depositAmount} deposit
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground truncate">{service.description}</p>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <DollarSign className="h-4 w-4" />
        <span>{formatCurrency(service.basePrice)}</span>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Timer className="h-4 w-4" />
        <span>{service.baseDuration} min</span>
      </div>

      <Switch checked={service.isActive} onCheckedChange={onToggle} />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Service
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Service
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ServiceDialog({
  service,
  open,
  onOpenChange,
  onSave,
}: {
  service?: Service | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (service: Service) => void;
}) {
  const isEditing = !!service;
  const [formData, setFormData] = React.useState<Partial<Service>>({
    name: "",
    description: "",
    category: "grooming",
    basePrice: 50,
    baseDuration: 60,
    isActive: true,
    requiresDeposit: false,
    depositAmount: 25,
    sortOrder: 1,
    sizeModifiers: {
      small: { price: 0, duration: 0 },
      medium: { price: 15, duration: 15 },
      large: { price: 30, duration: 30 },
      xlarge: { price: 50, duration: 45 },
    },
  });

  React.useEffect(() => {
    if (service) {
      setFormData(service);
    } else {
      setFormData({
        name: "",
        description: "",
        category: "grooming",
        basePrice: 50,
        baseDuration: 60,
        isActive: true,
        requiresDeposit: false,
        depositAmount: 25,
        sortOrder: 1,
        sizeModifiers: {
          small: { price: 0, duration: 0 },
          medium: { price: 15, duration: 15 },
          large: { price: 30, duration: 30 },
          xlarge: { price: 50, duration: 45 },
        },
      });
    }
  }, [service, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Service);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Service" : "Add New Service"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update service details and pricing" : "Create a new grooming service"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Service Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Full Groom"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) =>
                    setFormData((prev) => ({ ...prev, category: v as Service["category"] }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grooming">Full Grooming</SelectItem>
                    <SelectItem value="bath">Bath Services</SelectItem>
                    <SelectItem value="specialty">Specialty</SelectItem>
                    <SelectItem value="add-on">Add-On</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this service includes..."
                rows={3}
              />
            </div>
          </div>

          <Separator />

          {/* Pricing */}
          <div className="space-y-4">
            <h4 className="font-semibold">Base Pricing</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="basePrice">Base Price</Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">$</span>
                  <Input
                    id="basePrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.basePrice}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, basePrice: parseFloat(e.target.value) || 0 }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="baseDuration">Base Duration (minutes)</Label>
                <Input
                  id="baseDuration"
                  type="number"
                  min="0"
                  value={formData.baseDuration}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, baseDuration: parseInt(e.target.value) || 0 }))
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Size Modifiers */}
          <div className="space-y-4">
            <h4 className="font-semibold">Size Modifiers</h4>
            <p className="text-sm text-muted-foreground">
              Additional price and time adjustments based on pet size
            </p>
            <div className="grid grid-cols-4 gap-4">
              {(["small", "medium", "large", "xlarge"] as const).map((size) => {
                const defaultModifier = { price: 0, duration: 0 };
                return (
                  <Card key={size} className="p-3">
                    <p className="font-medium capitalize mb-2">{size === "xlarge" ? "X-Large" : size}</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">+$</span>
                        <Input
                          type="number"
                          min="0"
                          className="h-8 text-sm"
                          value={formData.sizeModifiers?.[size]?.price ?? 0}
                          onChange={(e) => {
                            const newPrice = parseFloat(e.target.value) || 0;
                            setFormData((prev) => {
                              const currentModifier = prev.sizeModifiers?.[size] ?? defaultModifier;
                              return {
                                ...prev,
                                sizeModifiers: {
                                  small: prev.sizeModifiers?.small ?? defaultModifier,
                                  medium: prev.sizeModifiers?.medium ?? defaultModifier,
                                  large: prev.sizeModifiers?.large ?? defaultModifier,
                                  xlarge: prev.sizeModifiers?.xlarge ?? defaultModifier,
                                  [size]: { ...currentModifier, price: newPrice },
                                },
                              };
                            });
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">+</span>
                        <Input
                          type="number"
                          min="0"
                          className="h-8 text-sm"
                          value={formData.sizeModifiers?.[size]?.duration ?? 0}
                          onChange={(e) => {
                            const newDuration = parseInt(e.target.value) || 0;
                            setFormData((prev) => {
                              const currentModifier = prev.sizeModifiers?.[size] ?? defaultModifier;
                              return {
                                ...prev,
                                sizeModifiers: {
                                  small: prev.sizeModifiers?.small ?? defaultModifier,
                                  medium: prev.sizeModifiers?.medium ?? defaultModifier,
                                  large: prev.sizeModifiers?.large ?? defaultModifier,
                                  xlarge: prev.sizeModifiers?.xlarge ?? defaultModifier,
                                  [size]: { ...currentModifier, duration: newDuration },
                                },
                              };
                            });
                          }}
                        />
                        <span className="text-xs text-muted-foreground">min</span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Deposit Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Require Deposit</h4>
                <p className="text-sm text-muted-foreground">
                  Collect a deposit when this service is booked
                </p>
              </div>
              <Switch
                checked={formData.requiresDeposit}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, requiresDeposit: checked }))
                }
              />
            </div>
            {formData.requiresDeposit && (
              <div className="space-y-2">
                <Label htmlFor="depositAmount">Deposit Amount</Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">$</span>
                  <Input
                    id="depositAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-32"
                    value={formData.depositAmount || 25}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        depositAmount: parseFloat(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              {isEditing ? "Update Service" : "Create Service"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
