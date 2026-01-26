"use client";

import * as React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/data-display/empty-state";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Plus,
  MoreHorizontal,
  Clock,
  Calendar,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Users,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { format, subDays, subHours } from "date-fns";
import { clients, services, getClientById, getServiceById } from "@/lib/mock-data";

interface WaitlistEntry {
  id: string;
  clientId: string;
  petName: string;
  serviceId: string;
  preferredDays: string[];
  preferredTimeRange: string;
  notes: string;
  priority: "normal" | "high" | "urgent";
  createdAt: string;
  contactedAt?: string;
}

const mockWaitlist: WaitlistEntry[] = [
  {
    id: "wl_1",
    clientId: "cli_1",
    petName: "Max",
    serviceId: "svc_1",
    preferredDays: ["Monday", "Wednesday", "Friday"],
    preferredTimeRange: "Morning (8am-12pm)",
    notes: "Flexible on timing, just needs appointment this week",
    priority: "high",
    createdAt: subDays(new Date(), 2).toISOString(),
  },
  {
    id: "wl_2",
    clientId: "cli_3",
    petName: "Coco, Mochi, Bruno",
    serviceId: "svc_1",
    preferredDays: ["Saturday"],
    preferredTimeRange: "Any time",
    notes: "Needs all 3 dogs done together",
    priority: "normal",
    createdAt: subDays(new Date(), 5).toISOString(),
    contactedAt: subDays(new Date(), 3).toISOString(),
  },
  {
    id: "wl_3",
    clientId: "cli_5",
    petName: "Rex",
    serviceId: "svc_2",
    preferredDays: ["Tuesday", "Thursday"],
    preferredTimeRange: "Afternoon (12pm-5pm)",
    notes: "Getting matted, needs appointment soon",
    priority: "urgent",
    createdAt: subHours(new Date(), 6).toISOString(),
  },
  {
    id: "wl_4",
    clientId: "cli_8",
    petName: "Duke",
    serviceId: "svc_3",
    preferredDays: ["Any day"],
    preferredTimeRange: "Morning (8am-12pm)",
    notes: "",
    priority: "normal",
    createdAt: subDays(new Date(), 7).toISOString(),
  },
];

const priorityConfig = {
  normal: { label: "Normal", color: "bg-gray-100 text-gray-700" },
  high: { label: "High", color: "bg-amber-100 text-amber-700" },
  urgent: { label: "Urgent", color: "bg-red-100 text-red-700" },
};

export default function WaitlistPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [waitlist, setWaitlist] = React.useState(mockWaitlist);
  const [showAddDialog, setShowAddDialog] = React.useState(false);

  const filteredWaitlist = React.useMemo(() => {
    if (!searchQuery) return waitlist;
    const query = searchQuery.toLowerCase();
    return waitlist.filter((entry) => {
      const client = getClientById(entry.clientId);
      return (
        entry.petName.toLowerCase().includes(query) ||
        client?.firstName.toLowerCase().includes(query) ||
        client?.lastName.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, waitlist]);

  // Sort by priority then date
  const sortedWaitlist = [...filteredWaitlist].sort((a, b) => {
    const priorityOrder = { urgent: 0, high: 1, normal: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  const handleBook = (entryId: string) => {
    toast({
      title: "Booking started",
      description: "Redirecting to appointment creation...",
    });
  };

  const handleRemove = (entryId: string) => {
    setWaitlist((prev) => prev.filter((e) => e.id !== entryId));
    toast({
      title: "Removed from waitlist",
      description: "The entry has been removed.",
    });
  };

  const handleContact = (entryId: string) => {
    setWaitlist((prev) =>
      prev.map((e) =>
        e.id === entryId ? { ...e, contactedAt: new Date().toISOString() } : e
      )
    );
    toast({
      title: "Marked as contacted",
      description: "The client has been marked as contacted.",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Waitlist"
        description="Manage clients waiting for appointments"
        actions={
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add to Waitlist
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add to Waitlist</DialogTitle>
                <DialogDescription>
                  Add a client to the waitlist for an appointment
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Client</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.slice(0, 10).map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.firstName} {client.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Service</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.filter(s => s.category !== "add-on").map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select defaultValue="normal">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea placeholder="Preferred times, special requests, etc." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  setShowAddDialog(false);
                  toast({ title: "Added to waitlist" });
                }}>
                  Add to Waitlist
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{waitlist.length}</p>
                <p className="text-sm text-muted-foreground">Total Waiting</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {waitlist.filter((e) => e.priority === "urgent").length}
                </p>
                <p className="text-sm text-muted-foreground">Urgent</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {waitlist.filter((e) => e.contactedAt).length}
                </p>
                <p className="text-sm text-muted-foreground">Contacted</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search waitlist..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Waitlist */}
      {sortedWaitlist.length > 0 ? (
        <div className="space-y-3">
          {sortedWaitlist.map((entry) => {
            const client = getClientById(entry.clientId);
            const service = getServiceById(entry.serviceId);
            const priority = priorityConfig[entry.priority];

            return (
              <Card key={entry.id}>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarFallback>
                          {client?.firstName[0]}{client?.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">
                            {client?.firstName} {client?.lastName}
                          </p>
                          <Badge className={priority.color}>
                            {priority.label}
                          </Badge>
                          {entry.contactedAt && (
                            <Badge variant="outline" className="text-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Contacted
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {entry.petName} • {service?.name}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {entry.preferredDays.join(", ")}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {entry.preferredTimeRange}
                          </span>
                        </div>
                        {entry.notes && (
                          <p className="text-sm mt-2 text-muted-foreground italic">
                            &quot;{entry.notes}&quot;
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          Added {format(new Date(entry.createdAt), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" onClick={() => handleBook(entry.id)}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Book
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <a href={`tel:${client?.phone}`}>
                              <Phone className="h-4 w-4 mr-2" />
                              Call
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <a href={`mailto:${client?.email}`}>
                              <Mail className="h-4 w-4 mr-2" />
                              Email
                            </a>
                          </DropdownMenuItem>
                          {!entry.contactedAt && (
                            <DropdownMenuItem onClick={() => handleContact(entry.id)}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark Contacted
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleRemove(entry.id)}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="Waitlist is empty"
          description="No clients are currently waiting for appointments"
          action={{
            label: "Add to Waitlist",
            onClick: () => setShowAddDialog(true),
          }}
        />
      )}
    </div>
  );
}
