"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
} from "@/components/ui/dialog";
import { cn, formatCurrency } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  MoreHorizontal,
  Send,
  Download,
  Printer,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  FileText,
  CreditCard,
  Calendar,
  User,
  Dog,
  AlertCircle,
} from "lucide-react";
import { format, subDays } from "date-fns";
import { getClientById } from "@/lib/mock-data";

type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "canceled";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Invoice {
  id: string;
  number: string;
  clientId: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  paidAt?: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  notes?: string;
  paymentMethod?: string;
}

// Mock invoice data
const mockInvoice: Invoice = {
  id: "inv_1",
  number: "INV-2025-001",
  clientId: "cli_1",
  status: "paid",
  issueDate: subDays(new Date(), 12).toISOString(),
  dueDate: subDays(new Date(), 5).toISOString(),
  paidAt: subDays(new Date(), 7).toISOString(),
  items: [
    { id: "1", description: "Full Groom - Max (Golden Retriever)", quantity: 1, unitPrice: 85, total: 85 },
    { id: "2", description: "De-shedding Treatment", quantity: 1, unitPrice: 35, total: 35 },
    { id: "3", description: "Nail Trim", quantity: 1, unitPrice: 15, total: 15 },
    { id: "4", description: "Full Groom - Bella (Poodle)", quantity: 1, unitPrice: 50, total: 50 },
  ],
  subtotal: 185,
  tax: 0,
  discount: 0,
  total: 185,
  notes: "Thank you for your business!",
  paymentMethod: "Credit Card (****4242)",
};

const statusConfig: Record<InvoiceStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ElementType; color: string }> = {
  draft: { label: "Draft", variant: "secondary", icon: FileText, color: "text-muted-foreground" },
  sent: { label: "Sent", variant: "outline", icon: Send, color: "text-blue-600" },
  paid: { label: "Paid", variant: "default", icon: CheckCircle, color: "text-green-600" },
  overdue: { label: "Overdue", variant: "destructive", icon: AlertCircle, color: "text-red-600" },
  canceled: { label: "Canceled", variant: "secondary", icon: XCircle, color: "text-muted-foreground" },
};

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const [invoice, setInvoice] = React.useState<Invoice>(mockInvoice);
  const [showMarkPaidDialog, setShowMarkPaidDialog] = React.useState(false);

  const client = getClientById(invoice.clientId);
  const config = statusConfig[invoice.status];
  const StatusIcon = config.icon;

  const handleMarkPaid = () => {
    setInvoice((prev) => ({
      ...prev,
      status: "paid",
      paidAt: new Date().toISOString(),
    }));
    setShowMarkPaidDialog(false);
    toast({
      title: "Invoice marked as paid",
      description: "The invoice status has been updated.",
    });
  };

  const handleSendReminder = () => {
    toast({
      title: "Reminder sent",
      description: `A payment reminder has been sent to ${client?.email}`,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Invoice ${invoice.number}`}
        description={`Created ${format(new Date(invoice.issueDate), "MMMM d, yyyy")}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href="/invoices">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Send className="h-4 w-4 mr-2" />
                  Send to Client
                </DropdownMenuItem>
                {invoice.status !== "paid" && invoice.status !== "canceled" && (
                  <>
                    <DropdownMenuItem onClick={handleSendReminder}>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Reminder
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowMarkPaidDialog(true)}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Paid
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel Invoice
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Invoice */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Banner */}
          <Card className={cn(
            invoice.status === "paid" && "border-green-200 bg-green-50",
            invoice.status === "overdue" && "border-red-200 bg-red-50",
            invoice.status === "draft" && "border-muted",
          )}>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <StatusIcon className={cn("h-5 w-5", config.color)} />
                  <div>
                    <p className={cn("font-medium", config.color)}>{config.label}</p>
                    {invoice.status === "paid" && invoice.paidAt && (
                      <p className="text-sm text-muted-foreground">
                        Paid on {format(new Date(invoice.paidAt), "MMMM d, yyyy")}
                      </p>
                    )}
                    {invoice.status === "overdue" && (
                      <p className="text-sm text-red-600">
                        {Math.floor((Date.now() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24))} days overdue
                      </p>
                    )}
                  </div>
                </div>
                <Badge variant={config.variant}>
                  {config.label}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Items */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Header */}
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground pb-2 border-b">
                  <div className="col-span-6">Description</div>
                  <div className="col-span-2 text-right">Qty</div>
                  <div className="col-span-2 text-right">Price</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>

                {/* Items */}
                {invoice.items.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 text-sm py-2">
                    <div className="col-span-6">{item.description}</div>
                    <div className="col-span-2 text-right">{item.quantity}</div>
                    <div className="col-span-2 text-right">{formatCurrency(item.unitPrice)}</div>
                    <div className="col-span-2 text-right font-medium">{formatCurrency(item.total)}</div>
                  </div>
                ))}

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(invoice.subtotal)}</span>
                  </div>
                  {invoice.tax > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span>{formatCurrency(invoice.tax)}</span>
                    </div>
                  )}
                  {invoice.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-{formatCurrency(invoice.discount)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(invoice.total)}</span>
                  </div>
                </div>

                {invoice.notes && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Notes</p>
                      <p className="text-sm">{invoice.notes}</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Client Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Bill To</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">
                    {client?.firstName} {client?.lastName}
                  </p>
                  <Link
                    href={`/clients/${client?.id}`}
                    className="text-sm text-primary hover:underline"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{client?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{client?.phone}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Invoice Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Invoice Number</span>
                <span className="font-medium">{invoice.number}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Issue Date</span>
                <span>{format(new Date(invoice.issueDate), "MMM d, yyyy")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Due Date</span>
                <span className={cn(
                  invoice.status === "overdue" && "text-red-600 font-medium"
                )}>
                  {format(new Date(invoice.dueDate), "MMM d, yyyy")}
                </span>
              </div>
              {invoice.paidAt && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Paid Date</span>
                  <span className="text-green-600">
                    {format(new Date(invoice.paidAt), "MMM d, yyyy")}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Info */}
          {invoice.status === "paid" && invoice.paymentMethod && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span>{invoice.paymentMethod}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions for unpaid */}
          {(invoice.status === "sent" || invoice.status === "overdue") && (
            <Card>
              <CardContent className="pt-6 space-y-3">
                <Button className="w-full" onClick={() => setShowMarkPaidDialog(true)}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Paid
                </Button>
                <Button variant="outline" className="w-full" onClick={handleSendReminder}>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Reminder
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Mark as Paid Dialog */}
      <Dialog open={showMarkPaidDialog} onOpenChange={setShowMarkPaidDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Invoice as Paid</DialogTitle>
            <DialogDescription>
              This will mark invoice {invoice.number} as paid. The payment date will be set to today.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <span className="font-medium">Total Amount</span>
              <span className="text-xl font-bold">{formatCurrency(invoice.total)}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMarkPaidDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleMarkPaid}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirm Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
