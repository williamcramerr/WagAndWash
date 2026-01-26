"use client";

import * as React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import { PetAvatar } from "@/components/ui/pet-avatar";
import { cn, formatCurrency, formatDate, getInitials } from "@/lib/utils";
import {
  Plus,
  Search,
  MoreHorizontal,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Star,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import {
  clients,
  getPetsByClientId,
  getAppointmentsByClientId,
  type Client,
} from "@/lib/mock-data";

type SortField = "name" | "lastVisit" | "totalSpent" | "createdAt";
type SortOrder = "asc" | "desc";

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [tagFilter, setTagFilter] = React.useState<string>("all");
  const [sortField, setSortField] = React.useState<SortField>("lastVisit");
  const [sortOrder, setSortOrder] = React.useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  // Filter and sort clients
  const filteredClients = React.useMemo(() => {
    let result = [...clients];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (client) =>
          `${client.firstName} ${client.lastName}`.toLowerCase().includes(query) ||
          client.email.toLowerCase().includes(query) ||
          client.phone.includes(query)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((client) =>
        statusFilter === "active" ? client.isActive : !client.isActive
      );
    }

    // Tag filter
    if (tagFilter !== "all") {
      result = result.filter((client) => client.tags.includes(tagFilter));
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "name":
          comparison = `${a.firstName} ${a.lastName}`.localeCompare(
            `${b.firstName} ${b.lastName}`
          );
          break;
        case "lastVisit":
          comparison =
            new Date(a.lastVisit || 0).getTime() -
            new Date(b.lastVisit || 0).getTime();
          break;
        case "totalSpent":
          comparison = a.totalSpent - b.totalSpent;
          break;
        case "createdAt":
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [searchQuery, statusFilter, tagFilter, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get unique tags for filter
  const allTags = React.useMemo(() => {
    const tags = new Set<string>();
    clients.forEach((client) => client.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags);
  }, []);

  const handleExport = () => {
    // In a real app, this would generate and download a CSV
    const csv = [
      ["Name", "Email", "Phone", "Status", "Tags", "Total Spent", "Last Visit"],
      ...filteredClients.map((client) => [
        `${client.firstName} ${client.lastName}`,
        client.email,
        client.phone,
        client.isActive ? "Active" : "Inactive",
        client.tags.join("; "),
        client.totalSpent.toString(),
        client.lastVisit || "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "clients.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clients"
        description="Manage your client database"
        actions={
          <Button asChild>
            <Link href="/clients/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Link>
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{clients.length}</div>
            <p className="text-xs text-muted-foreground">Total Clients</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {clients.filter((c) => c.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {clients.filter((c) => c.tags.includes("VIP")).length}
            </div>
            <p className="text-xs text-muted-foreground">VIP Clients</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {formatCurrency(clients.reduce((sum, c) => sum + c.totalSpent, 0))}
            </div>
            <p className="text-xs text-muted-foreground">Lifetime Revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select value={tagFilter} onValueChange={setTagFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Tags" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tags</SelectItem>
            {allTags.map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Client Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">
                <button
                  className="flex items-center gap-1 hover:text-foreground"
                  onClick={() => {
                    if (sortField === "name") {
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    } else {
                      setSortField("name");
                      setSortOrder("asc");
                    }
                  }}
                >
                  Client
                  {sortField === "name" && (
                    <span className="text-primary">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </button>
              </TableHead>
              <TableHead>Pets</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>
                <button
                  className="flex items-center gap-1 hover:text-foreground"
                  onClick={() => {
                    if (sortField === "lastVisit") {
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    } else {
                      setSortField("lastVisit");
                      setSortOrder("desc");
                    }
                  }}
                >
                  Last Visit
                  {sortField === "lastVisit" && (
                    <span className="text-primary">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </button>
              </TableHead>
              <TableHead className="text-right">
                <button
                  className="flex items-center gap-1 hover:text-foreground ml-auto"
                  onClick={() => {
                    if (sortField === "totalSpent") {
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    } else {
                      setSortField("totalSpent");
                      setSortOrder("desc");
                    }
                  }}
                >
                  Total Spent
                  {sortField === "totalSpent" && (
                    <span className="text-primary">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </button>
              </TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedClients.map((client) => (
              <ClientRow key={client.id} client={client} />
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredClients.length)} of{" "}
            {filteredClients.length} clients
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function ClientRow({ client }: { client: Client }) {
  const pets = getPetsByClientId(client.id);
  const appointments = getAppointmentsByClientId(client.id);
  const hasSafetyFlags = pets.some((p) => p.safetyFlags.length > 0);

  return (
    <TooltipProvider>
      <TableRow className="group">
        <TableCell>
          <Link
            href={`/clients/${client.id}`}
            className="flex items-center gap-3 hover:underline"
          >
            <Avatar>
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials(`${client.firstName} ${client.lastName}`)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {client.firstName} {client.lastName}
                </span>
                {client.tags.includes("VIP") && (
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                )}
                {hasSafetyFlags && (
                  <Tooltip>
                    <TooltipTrigger>
                      <AlertTriangle className="h-3 w-3 text-destructive" />
                    </TooltipTrigger>
                    <TooltipContent>Pet has safety flags</TooltipContent>
                  </Tooltip>
                )}
              </div>
              <div className="flex gap-1 mt-1">
                {client.tags
                  .filter((t) => t !== "VIP")
                  .slice(0, 2)
                  .map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
              </div>
            </div>
          </Link>
        </TableCell>
        <TableCell>
          <div className="flex -space-x-2">
            {pets.slice(0, 3).map((pet) => (
              <Tooltip key={pet.id}>
                <TooltipTrigger>
                  <PetAvatar
                    name={pet.name}
                    species={pet.species}
                    hasSafetyFlags={pet.safetyFlags.length > 0}
                    size="sm"
                    className="ring-2 ring-background"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  {pet.name} - {pet.breed}
                </TooltipContent>
              </Tooltip>
            ))}
            {pets.length > 3 && (
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium ring-2 ring-background">
                +{pets.length - 3}
              </div>
            )}
          </div>
        </TableCell>
        <TableCell>
          <div className="flex flex-col gap-1 text-sm">
            <a
              href={`mailto:${client.email}`}
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
            >
              <Mail className="h-3 w-3" />
              <span className="truncate max-w-[150px]">{client.email}</span>
            </a>
            <a
              href={`tel:${client.phone}`}
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
            >
              <Phone className="h-3 w-3" />
              {client.phone}
            </a>
          </div>
        </TableCell>
        <TableCell>
          {client.lastVisit ? (
            <div className="flex items-center gap-1 text-sm">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              {formatDate(client.lastVisit)}
            </div>
          ) : (
            <span className="text-muted-foreground text-sm">Never</span>
          )}
        </TableCell>
        <TableCell className="text-right font-medium">
          {formatCurrency(client.totalSpent)}
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/clients/${client.id}`}>View Details</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/clients/${client.id}/edit`}>Edit Client</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/appointments/new?client=${client.id}`}>
                  Book Appointment
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Phone className="h-4 w-4 mr-2" />
                Call
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    </TooltipProvider>
  );
}
