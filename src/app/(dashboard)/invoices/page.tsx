"use client";

import * as React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/data-display/empty-state";
import { cn, formatCurrency } from "@/lib/utils";
import {
  Search,
  Plus,
  MoreHorizontal,
  FileText,
  Send,
  Download,
  Eye,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { format, subDays } from "date-fns";
import { clients, getClientById } from "@/lib/mock-data";

type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "canceled";

interface Invoice {
  id: string;
  number: string;
  clientId: string;
  amount: number;
  status: InvoiceStatus;
  dueDate: string;
  createdAt: string;
  paidAt?: string;
  items: { description: string; amount: number }[];
}

// Mock invoices
const mockInvoices: Invoice[] = [
  {
    id: "inv_1",
    number: "INV-2025-001",
    clientId: "cli_1",
    amount: 185.00,
    status: "paid",
    dueDate: subDays(new Date(), 5).toISOString(),
    createdAt: subDays(new Date(), 12).toISOString(),
    paidAt: subDays(new Date(), 7).toISOString(),
    items: [
      { description: "Full Groom - Max", amount: 85.00 },
      { description: "De-shedding Treatment", amount: 35.00 },
      { description: "Nail Trim - Max", amount: 15.00 },
      { description: "Full Groom - Bella", amount: 50.00 },
    ],
  },
  {
    id: "inv_2",
    number: "INV-2025-002",
    clientId: "cli_3",
    amount: 245.00,
    status: "sent",
    dueDate: new Date().toISOString(),
    createdAt: subDays(new Date(), 7).toISOString(),
    items: [
      { description: "Full Groom - Coco", amount: 75.00 },
      { description: "Full Groom - Mochi", amount: 85.00 },
      { description: "Full Groom - Bruno", amount: 85.00 },
    ],
  },
  {
    id: "inv_3",
    number: "INV-2025-003",
    clientId: "cli_5",
    amount: 120.00,
    status: "overdue",
    dueDate: subDays(new Date(), 3).toISOString(),
    createdAt: subDays(new Date(), 10).toISOString(),
    items: [
      { description: "Full Groom - Rex", amount: 95.00 },
      { description: "Teeth Brushing", amount: 25.00 },
    ],
  },
  {
    id: "inv_4",
    number: "INV-2025-004",
    clientId: "cli_2",
    amount: 70.00,
    status: "draft",
    dueDate: subDays(new Date(), -14).toISOString(),
    createdAt: new Date().toISOString(),
    items: [
      { description: "Bath & Brush - Buddy", amount: 55.00 },
      { description: "Nail Trim", amount: 15.00 },
    ],
  },
];

const statusConfig: Record<InvoiceStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ElementType }> = {
  draft: { label: "Draft", variant: "secondary", icon: FileText },
  sent: { label: "Sent", variant: "outline", icon: Send },
  paid: { label: "Paid", variant: "default", icon: CheckCircle },
  overdue: { label: "Overdue", variant: "destructive", icon: AlertCircle },
  canceled: { label: "Canceled", variant: "secondary", icon: XCircle },
};

export default function InvoicesPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<InvoiceStatus | "all">("all");

  const filteredInvoices = React.useMemo(() => {
    let result = [...mockInvoices];

    if (statusFilter !== "all") {
      result = result.filter((inv) => inv.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((inv) => {
        const client = getClientById(inv.clientId);
        return (
          inv.number.toLowerCase().includes(query) ||
          client?.firstName.toLowerCase().includes(query) ||
          client?.lastName.toLowerCase().includes(query)
        );
      });
    }

    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [searchQuery, statusFilter]);

  // Stats
  const totalOutstanding = mockInvoices
    .filter((inv) => inv.status === "sent" || inv.status === "overdue")
    .reduce((sum, inv) => sum + inv.amount, 0);
  const overdueCount = mockInvoices.filter((inv) => inv.status === "overdue").length;
  const paidThisMonth = mockInvoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices"
        description="Manage client invoices and billing"
        actions={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(totalOutstanding)}</p>
                <p className="text-sm text-muted-foreground">Outstanding</p>
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
                <p className="text-2xl font-bold">{overdueCount}</p>
                <p className="text-sm text-muted-foreground">Overdue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(paidThisMonth)}</p>
                <p className="text-sm text-muted-foreground">Collected This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search invoices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as InvoiceStatus | "all")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Invoices Table */}
      {filteredInvoices.length > 0 ? (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => {
                const client = getClientById(invoice.clientId);
                const config = statusConfig[invoice.status];
                const StatusIcon = config.icon;

                return (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{invoice.number}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(invoice.createdAt), "MMM d, yyyy")}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {client?.firstName} {client?.lastName}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(invoice.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={config.variant}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {config.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={cn(
                        invoice.status === "overdue" && "text-destructive font-medium"
                      )}>
                        {format(new Date(invoice.dueDate), "MMM d, yyyy")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </DropdownMenuItem>
                          {invoice.status === "draft" && (
                            <DropdownMenuItem>
                              <Send className="h-4 w-4 mr-2" />
                              Send to Client
                            </DropdownMenuItem>
                          )}
                          {(invoice.status === "sent" || invoice.status === "overdue") && (
                            <DropdownMenuItem>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark as Paid
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancel
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <EmptyState
          icon={FileText}
          title="No invoices found"
          description={searchQuery || statusFilter !== "all" ? "Try adjusting your filters" : "Create your first invoice to get started"}
          action={{
            label: "New Invoice",
            onClick: () => {},
          }}
        />
      )}
    </div>
  );
}
