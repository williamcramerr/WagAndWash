"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
import { useToast } from "@/hooks/use-toast";
import { cn, formatCurrency } from "@/lib/utils";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Send,
  CalendarIcon,
  ChevronsUpDown,
  Check,
  User,
} from "lucide-react";
import { format, addDays, subDays } from "date-fns";
import { clients, services, getClientById } from "@/lib/mock-data";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

// Mock existing invoice data (would come from API in real app)
const existingInvoice = {
  id: "inv_1",
  number: "INV-2025-001",
  clientId: "cli_1",
  status: "draft" as const,
  dueDate: addDays(new Date(), 7),
  notes: "Thank you for your business!",
  items: [
    { id: "1", description: "Full Groom - Max (Golden Retriever)", quantity: 1, unitPrice: 85 },
    { id: "2", description: "De-shedding Treatment", quantity: 1, unitPrice: 35 },
    { id: "3", description: "Nail Trim", quantity: 1, unitPrice: 15 },
    { id: "4", description: "Full Groom - Bella (Poodle)", quantity: 1, unitPrice: 50 },
  ],
};

export default function EditInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const [clientId, setClientId] = React.useState(existingInvoice.clientId);
  const [clientOpen, setClientOpen] = React.useState(false);
  const [dueDate, setDueDate] = React.useState<Date>(existingInvoice.dueDate);
  const [dueDateOpen, setDueDateOpen] = React.useState(false);
  const [notes, setNotes] = React.useState(existingInvoice.notes);
  const [items, setItems] = React.useState<InvoiceItem[]>(existingInvoice.items);
  const [isSaving, setIsSaving] = React.useState(false);

  const selectedClient = clientId ? getClientById(clientId) : null;

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), description: "", quantity: 1, unitPrice: 0 },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const tax = 0;
  const total = subtotal + tax;

  const handleSave = async (send: boolean = false) => {
    if (!clientId) {
      toast({
        title: "Client required",
        description: "Please select a client for this invoice.",
        variant: "destructive",
      });
      return;
    }

    if (items.every((item) => !item.description || item.unitPrice === 0)) {
      toast({
        title: "Items required",
        description: "Please add at least one item to the invoice.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: send ? "Invoice updated & sent" : "Invoice updated",
      description: send
        ? `Updated invoice has been sent to ${selectedClient?.email}`
        : "Invoice changes have been saved.",
    });

    setIsSaving(false);
    router.push(`/invoices/${params.id}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Edit Invoice ${existingInvoice.number}`}
        description="Modify invoice details and line items"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href={`/invoices/${params.id}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Cancel
              </Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSave(false)}
              disabled={isSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            <Button onClick={() => handleSave(true)} disabled={isSaving}>
              <Send className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save & Send"}
            </Button>
          </div>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Client</CardTitle>
              <CardDescription>Who is this invoice for?</CardDescription>
            </CardHeader>
            <CardContent>
              <Popover open={clientOpen} onOpenChange={setClientOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={clientOpen}
                    className="w-full justify-between"
                  >
                    {selectedClient ? (
                      <span className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {selectedClient.firstName} {selectedClient.lastName}
                      </span>
                    ) : (
                      "Select client..."
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
                        {clients.slice(0, 20).map((client) => (
                          <CommandItem
                            key={client.id}
                            value={`${client.firstName} ${client.lastName}`}
                            onSelect={() => {
                              setClientId(client.id);
                              setClientOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                clientId === client.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {client.firstName} {client.lastName}
                            <span className="ml-2 text-xs text-muted-foreground">
                              {client.email}
                            </span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {selectedClient && (
                <div className="mt-4 p-3 bg-muted rounded-lg text-sm">
                  <p className="font-medium">
                    {selectedClient.firstName} {selectedClient.lastName}
                  </p>
                  <p className="text-muted-foreground">{selectedClient.email}</p>
                  <p className="text-muted-foreground">{selectedClient.phone}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Invoice Items */}
          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
              <CardDescription>Edit services or products on this invoice</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Header */}
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground">
                <div className="col-span-6">Description</div>
                <div className="col-span-2">Qty</div>
                <div className="col-span-3">Price</div>
                <div className="col-span-1"></div>
              </div>

              {/* Items */}
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 items-start">
                  <div className="col-span-6">
                    <Input
                      placeholder="Service or item description"
                      value={item.description}
                      onChange={(e) =>
                        updateItem(item.id, "description", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(item.id, "quantity", parseInt(e.target.value) || 1)
                      }
                    />
                  </div>
                  <div className="col-span-3">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        className="pl-7"
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)
                        }
                      />
                    </div>
                  </div>
                  <div className="col-span-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <Button variant="outline" onClick={addItem} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>

              {/* Quick Add from Services */}
              <div className="pt-4 border-t">
                <Label className="text-sm text-muted-foreground mb-2 block">
                  Quick add from services:
                </Label>
                <div className="flex flex-wrap gap-2">
                  {services
                    .filter((s) => s.category !== "add-on")
                    .slice(0, 5)
                    .map((service) => (
                      <Button
                        key={service.id}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newItem: InvoiceItem = {
                            id: Date.now().toString(),
                            description: service.name,
                            quantity: 1,
                            unitPrice: service.basePrice,
                          };
                          setItems([...items, newItem]);
                        }}
                      >
                        {service.name} - {formatCurrency(service.basePrice)}
                      </Button>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
              <CardDescription>
                Add any additional notes for the client
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Thank you for your business!"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Invoice Details */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Invoice Number</Label>
                <Input value={existingInvoice.number} disabled className="bg-muted" />
              </div>

              <div className="space-y-2">
                <Label>Due Date</Label>
                <Popover open={dueDateOpen} onOpenChange={setDueDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={(date) => {
                        if (date) setDueDate(date);
                        setDueDateOpen(false);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="pt-6 space-y-3">
              <Button
                className="w-full"
                onClick={() => handleSave(true)}
                disabled={isSaving}
              >
                <Send className="h-4 w-4 mr-2" />
                Save & Send
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleSave(false)}
                disabled={isSaving}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
