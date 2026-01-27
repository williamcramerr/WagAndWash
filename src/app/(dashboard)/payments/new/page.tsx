"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { cn, formatCurrency } from "@/lib/utils";
import {
  ArrowLeft,
  CreditCard,
  Banknote,
  FileText,
  Check,
  ChevronsUpDown,
  DollarSign,
  User,
  Receipt,
  Plus,
  Trash2,
} from "lucide-react";
import { clients, appointments, getServiceById, type Client, type Appointment } from "@/lib/mock-data";
import { format } from "date-fns";

type PaymentMethod = "card" | "cash" | "check";

interface LineItem {
  id: string;
  description: string;
  amount: number;
}

export default function NewPaymentPage() {
  const router = useRouter();
  const [selectedClient, setSelectedClient] = React.useState<Client | null>(null);
  const [selectedAppointment, setSelectedAppointment] = React.useState<Appointment | null>(null);
  const [clientOpen, setClientOpen] = React.useState(false);
  const [appointmentOpen, setAppointmentOpen] = React.useState(false);
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>("card");
  const [lineItems, setLineItems] = React.useState<LineItem[]>([
    { id: "1", description: "", amount: 0 },
  ]);
  const [tip, setTip] = React.useState<number>(0);
  const [notes, setNotes] = React.useState("");
  const [cardLast4, setCardLast4] = React.useState("");
  const [checkNumber, setCheckNumber] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Filter appointments for selected client
  const clientAppointments = React.useMemo(() => {
    if (!selectedClient) return [];
    return appointments.filter(
      (apt) =>
        apt.clientId === selectedClient.id &&
        (apt.status === "completed" || apt.status === "checked_in" || apt.status === "in_progress")
    );
  }, [selectedClient]);

  // Calculate totals
  const subtotal = lineItems.reduce((sum, item) => sum + (item.amount || 0), 0);
  const total = subtotal + tip;

  // Add line item
  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { id: Date.now().toString(), description: "", amount: 0 },
    ]);
  };

  // Remove line item
  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((item) => item.id !== id));
    }
  };

  // Update line item
  const updateLineItem = (id: string, field: "description" | "amount", value: string | number) => {
    setLineItems(
      lineItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // When appointment is selected, pre-fill line items
  React.useEffect(() => {
    if (selectedAppointment) {
      // Pre-fill with services from the appointment
      const newLineItems = selectedAppointment.services.map((service, idx) => {
        const serviceInfo = getServiceById(service.serviceId);
        return {
          id: `apt-${idx}`,
          description: serviceInfo?.name || "Service",
          amount: service.price,
        };
      });
      if (newLineItems.length > 0) {
        setLineItems(newLineItems);
      }
    }
  }, [selectedAppointment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In a real app, this would create the payment record
    router.push("/payments");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Record Payment"
        description="Create a new payment record"
        actions={
          <Button variant="ghost" asChild>
            <Link href="/payments">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Payments
            </Link>
          </Button>
        }
      />

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Client Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Client
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Client</Label>
                  <Popover open={clientOpen} onOpenChange={setClientOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={clientOpen}
                        className="w-full justify-between"
                      >
                        {selectedClient ? (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedClient.id}`}
                              />
                              <AvatarFallback>
                                {selectedClient.firstName[0]}
                                {selectedClient.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            {selectedClient.firstName} {selectedClient.lastName}
                          </div>
                        ) : (
                          "Search for a client..."
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search clients..." />
                        <CommandList>
                          <CommandEmpty>No client found.</CommandEmpty>
                          <CommandGroup>
                            {clients.map((client) => (
                              <CommandItem
                                key={client.id}
                                value={`${client.firstName} ${client.lastName}`}
                                onSelect={() => {
                                  setSelectedClient(client);
                                  setSelectedAppointment(null);
                                  setClientOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedClient?.id === client.id
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                <Avatar className="h-6 w-6 mr-2">
                                  <AvatarImage
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${client.id}`}
                                  />
                                  <AvatarFallback>
                                    {client.firstName[0]}
                                    {client.lastName[0]}
                                  </AvatarFallback>
                                </Avatar>
                                {client.firstName} {client.lastName}
                                <span className="ml-auto text-xs text-muted-foreground">
                                  {client.email}
                                </span>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {selectedClient && clientAppointments.length > 0 && (
                  <div className="space-y-2">
                    <Label>Link to Appointment (Optional)</Label>
                    <Popover open={appointmentOpen} onOpenChange={setAppointmentOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={appointmentOpen}
                          className="w-full justify-between"
                        >
                          {selectedAppointment ? (
                            <span>
                              {format(new Date(selectedAppointment.startTime), "MMM d, yyyy")} -{" "}
                              {selectedAppointment.services.map(s => getServiceById(s.serviceId)?.name || "Service").join(", ")}
                            </span>
                          ) : (
                            "Select an appointment..."
                          )}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search appointments..." />
                          <CommandList>
                            <CommandEmpty>No appointments found.</CommandEmpty>
                            <CommandGroup>
                              {clientAppointments.map((apt) => (
                                <CommandItem
                                  key={apt.id}
                                  value={apt.id}
                                  onSelect={() => {
                                    setSelectedAppointment(apt);
                                    setAppointmentOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedAppointment?.id === apt.id
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  <div>
                                    <p className="font-medium">
                                      {format(new Date(apt.startTime), "MMM d, yyyy 'at' h:mm a")}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {apt.services.map(s => getServiceById(s.serviceId)?.name || "Service").join(", ")}
                                    </p>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Line Items */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Line Items
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {lineItems.map((item, index) => (
                  <div key={item.id} className="flex gap-3 items-start">
                    <div className="flex-1 space-y-2">
                      <Label>Description</Label>
                      <Input
                        placeholder="Service or item description"
                        value={item.description}
                        onChange={(e) =>
                          updateLineItem(item.id, "description", e.target.value)
                        }
                      />
                    </div>
                    <div className="w-32 space-y-2">
                      <Label>Amount</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          className="pl-8"
                          placeholder="0.00"
                          value={item.amount || ""}
                          onChange={(e) =>
                            updateLineItem(
                              item.id,
                              "amount",
                              parseFloat(e.target.value) || 0
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="pt-8">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeLineItem(item.id)}
                        disabled={lineItems.length === 1}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={addLineItem}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Line Item
                </Button>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    type="button"
                    variant={paymentMethod === "card" ? "default" : "outline"}
                    className="flex flex-col gap-2 h-auto py-4"
                    onClick={() => setPaymentMethod("card")}
                  >
                    <CreditCard className="h-5 w-5" />
                    <span>Card</span>
                  </Button>
                  <Button
                    type="button"
                    variant={paymentMethod === "cash" ? "default" : "outline"}
                    className="flex flex-col gap-2 h-auto py-4"
                    onClick={() => setPaymentMethod("cash")}
                  >
                    <Banknote className="h-5 w-5" />
                    <span>Cash</span>
                  </Button>
                  <Button
                    type="button"
                    variant={paymentMethod === "check" ? "default" : "outline"}
                    className="flex flex-col gap-2 h-auto py-4"
                    onClick={() => setPaymentMethod("check")}
                  >
                    <FileText className="h-5 w-5" />
                    <span>Check</span>
                  </Button>
                </div>

                {paymentMethod === "card" && (
                  <div className="space-y-2">
                    <Label>Last 4 Digits (Optional)</Label>
                    <Input
                      placeholder="1234"
                      maxLength={4}
                      value={cardLast4}
                      onChange={(e) => setCardLast4(e.target.value.replace(/\D/g, ""))}
                    />
                  </div>
                )}

                {paymentMethod === "check" && (
                  <div className="space-y-2">
                    <Label>Check Number</Label>
                    <Input
                      placeholder="Check number"
                      value={checkNumber}
                      onChange={(e) => setCheckNumber(e.target.value)}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Tip Amount</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      className="pl-8"
                      placeholder="0.00"
                      value={tip || ""}
                      onChange={(e) => setTip(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Notes (Optional)</Label>
                  <Textarea
                    placeholder="Any additional notes about this payment..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedClient && (
                  <div className="flex items-center gap-3 pb-4 border-b">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedClient.id}`}
                      />
                      <AvatarFallback>
                        {selectedClient.firstName[0]}
                        {selectedClient.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {selectedClient.firstName} {selectedClient.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedClient.email}
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {lineItems
                    .filter((item) => item.description || item.amount > 0)
                    .map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.description || "Unnamed item"}
                        </span>
                        <span>{formatCurrency(item.amount)}</span>
                      </div>
                    ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  {tip > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tip</span>
                      <span>{formatCurrency(tip)}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {paymentMethod === "card" && <CreditCard className="h-4 w-4" />}
                  {paymentMethod === "cash" && <Banknote className="h-4 w-4" />}
                  {paymentMethod === "check" && <FileText className="h-4 w-4" />}
                  <span className="capitalize">{paymentMethod}</span>
                  {paymentMethod === "card" && cardLast4 && (
                    <span>ending in {cardLast4}</span>
                  )}
                  {paymentMethod === "check" && checkNumber && (
                    <span>#{checkNumber}</span>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={!selectedClient || total <= 0 || isSubmitting}
                >
                  {isSubmitting ? "Recording..." : `Record Payment - ${formatCurrency(total)}`}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
