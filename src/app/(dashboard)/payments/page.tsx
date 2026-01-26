"use client";

import * as React from "react";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import {
  Search,
  MoreHorizontal,
  DollarSign,
  CreditCard,
  TrendingUp,
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Eye,
  FileText,
  Undo2,
  Banknote,
} from "lucide-react";
import Link from "next/link";
import { subDays, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import {
  payments,
  getClientById,
  getAppointmentById,
  type Payment,
} from "@/lib/mock-data";

type DateRange = "today" | "week" | "month" | "all";
type PaymentStatus = "all" | "completed" | "pending" | "refunded" | "failed";

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [dateRange, setDateRange] = React.useState<DateRange>("month");
  const [statusFilter, setStatusFilter] = React.useState<PaymentStatus>("all");
  const [methodFilter, setMethodFilter] = React.useState<string>("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 15;

  const filteredPayments = React.useMemo(() => {
    let result = [...payments];

    // Date range filter
    const now = new Date();
    if (dateRange === "today") {
      result = result.filter((p) =>
        isWithinInterval(new Date(p.processedAt), {
          start: startOfDay(now),
          end: endOfDay(now),
        })
      );
    } else if (dateRange === "week") {
      result = result.filter(
        (p) => new Date(p.processedAt) >= subDays(now, 7)
      );
    } else if (dateRange === "month") {
      result = result.filter(
        (p) => new Date(p.processedAt) >= subDays(now, 30)
      );
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((payment) => {
        const client = getClientById(payment.clientId);
        return (
          client?.firstName.toLowerCase().includes(query) ||
          client?.lastName.toLowerCase().includes(query) ||
          payment.id.toLowerCase().includes(query)
        );
      });
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((p) => p.status === statusFilter);
    }

    // Method filter
    if (methodFilter !== "all") {
      result = result.filter((p) => p.method === methodFilter);
    }

    // Sort by date descending
    result.sort(
      (a, b) =>
        new Date(b.processedAt).getTime() - new Date(a.processedAt).getTime()
    );

    return result;
  }, [searchQuery, dateRange, statusFilter, methodFilter]);

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate stats
  const totalRevenue = filteredPayments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);
  const totalTips = filteredPayments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.tip, 0);
  const refundedAmount = filteredPayments
    .filter((p) => p.status === "refunded")
    .reduce((sum, p) => sum + p.amount, 0);
  const averageTransaction =
    filteredPayments.filter((p) => p.status === "completed").length > 0
      ? totalRevenue /
        filteredPayments.filter((p) => p.status === "completed").length
      : 0;

  const handleExport = () => {
    const csv = [
      ["ID", "Date", "Client", "Amount", "Tip", "Method", "Status"],
      ...filteredPayments.map((payment) => {
        const client = getClientById(payment.clientId);
        return [
          payment.id,
          formatDateTime(payment.processedAt),
          `${client?.firstName} ${client?.lastName}`,
          payment.amount.toString(),
          payment.tip.toString(),
          payment.method,
          payment.status,
        ];
      }),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payments-${dateRange}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payments"
        description="Track revenue and manage transactions"
        actions={
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {formatCurrency(totalRevenue)}
                </div>
                <p className="text-xs text-muted-foreground">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {formatCurrency(totalTips)}
                </div>
                <p className="text-xs text-muted-foreground">Tips Collected</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {formatCurrency(averageTransaction)}
                </div>
                <p className="text-xs text-muted-foreground">Avg Transaction</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                <RefreshCw className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {formatCurrency(refundedAmount)}
                </div>
                <p className="text-xs text-muted-foreground">Refunded</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Date Range Tabs */}
      <Tabs value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
        <TabsList>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
          <TabsTrigger value="all">All Time</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by client name or transaction ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as PaymentStatus)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={methodFilter} onValueChange={setMethodFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Methods</SelectItem>
            <SelectItem value="card">Card</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="check">Check</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Payments Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPayments.length > 0 ? (
              paginatedPayments.map((payment) => (
                <PaymentRow key={payment.id} payment={payment} />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <p className="text-muted-foreground">No payments found</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredPayments.length)} of{" "}
            {filteredPayments.length} transactions
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

function PaymentRow({ payment }: { payment: Payment }) {
  const client = getClientById(payment.clientId);
  const appointment = getAppointmentById(payment.appointmentId);

  const statusColors: Record<string, string> = {
    completed: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    refunded: "bg-red-100 text-red-700",
    failed: "bg-gray-100 text-gray-700",
  };

  const methodIcons: Record<string, React.ReactNode> = {
    card: <CreditCard className="h-4 w-4" />,
    cash: <Banknote className="h-4 w-4" />,
    check: <FileText className="h-4 w-4" />,
  };

  return (
    <TableRow className="group">
      <TableCell>
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center",
              payment.status === "completed"
                ? "bg-green-100"
                : payment.status === "refunded"
                ? "bg-red-100"
                : "bg-muted"
            )}
          >
            {payment.status === "completed" ? (
              <ArrowUpRight className="h-5 w-5 text-green-600" />
            ) : payment.status === "refunded" ? (
              <ArrowDownRight className="h-5 w-5 text-red-600" />
            ) : (
              <DollarSign className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div>
            <p className="font-medium text-sm">{payment.id}</p>
            {appointment && (
              <p className="text-xs text-muted-foreground">
                Appointment #{appointment.id.split("_")[1]}
              </p>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell>
        {client ? (
          <Link
            href={`/clients/${client.id}`}
            className="hover:underline font-medium"
          >
            {client.firstName} {client.lastName}
          </Link>
        ) : (
          <span className="text-muted-foreground">Unknown</span>
        )}
      </TableCell>
      <TableCell>
        <div>
          <p className="text-sm">{formatDate(payment.processedAt)}</p>
          <p className="text-xs text-muted-foreground">
            {formatDateTime(payment.processedAt).split(",")[1]?.trim()}
          </p>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {methodIcons[payment.method]}
          <span className="capitalize">{payment.method}</span>
          {payment.method === "card" && payment.cardLast4 && (
            <span className="text-muted-foreground">****{payment.cardLast4}</span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Badge className={cn("capitalize", statusColors[payment.status])}>
          {payment.status}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <div>
          <p className="font-semibold">{formatCurrency(payment.amount)}</p>
          {payment.tip > 0 && (
            <p className="text-xs text-muted-foreground">
              +{formatCurrency(payment.tip)} tip
            </p>
          )}
        </div>
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
            <DropdownMenuItem>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileText className="h-4 w-4 mr-2" />
              Download Receipt
            </DropdownMenuItem>
            {payment.status === "completed" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <Undo2 className="h-4 w-4 mr-2" />
                  Issue Refund
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
