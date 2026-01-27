"use client";

import * as React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
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
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import {
  CreditCard,
  CheckCircle,
  Download,
  MoreHorizontal,
  ArrowRight,
  Zap,
  Users,
  Building2,
  AlertCircle,
  Receipt,
  Calendar,
  Shield,
  ExternalLink,
} from "lucide-react";
import { format, subMonths } from "date-fns";

// Current subscription
const currentPlan = {
  name: "Team",
  price: 79,
  interval: "month" as const,
  status: "active" as const,
  currentPeriodStart: subMonths(new Date(), 0).toISOString(),
  currentPeriodEnd: new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    new Date().getDate()
  ).toISOString(),
  cancelAtPeriodEnd: false,
};

// Usage
const usage = {
  teamMembers: { used: 3, limit: 5 },
  appointments: { used: 247, limit: Infinity },
  smsReminders: { used: 182, limit: 500 },
  storage: { used: 1.2, limit: 5 }, // GB
};

// Invoices
const invoiceHistory = [
  {
    id: "inv_sub_1",
    date: subMonths(new Date(), 0).toISOString(),
    amount: 79,
    status: "upcoming" as const,
    description: "Team Plan - Monthly",
  },
  {
    id: "inv_sub_2",
    date: subMonths(new Date(), 1).toISOString(),
    amount: 79,
    status: "paid" as const,
    description: "Team Plan - Monthly",
  },
  {
    id: "inv_sub_3",
    date: subMonths(new Date(), 2).toISOString(),
    amount: 79,
    status: "paid" as const,
    description: "Team Plan - Monthly",
  },
  {
    id: "inv_sub_4",
    date: subMonths(new Date(), 3).toISOString(),
    amount: 79,
    status: "paid" as const,
    description: "Team Plan - Monthly",
  },
  {
    id: "inv_sub_5",
    date: subMonths(new Date(), 4).toISOString(),
    amount: 29,
    status: "paid" as const,
    description: "Solo Plan - Monthly",
  },
  {
    id: "inv_sub_6",
    date: subMonths(new Date(), 5).toISOString(),
    amount: 29,
    status: "paid" as const,
    description: "Solo Plan - Monthly",
  },
];

const plans = [
  {
    name: "Solo",
    price: 29,
    icon: Zap,
    description: "For independent groomers",
    features: [
      "Unlimited appointments",
      "Client & pet management",
      "Online booking",
      "Payment processing",
      "Email reminders",
      "1 team member",
    ],
  },
  {
    name: "Team",
    price: 79,
    icon: Users,
    popular: true,
    description: "For growing businesses",
    features: [
      "Everything in Solo",
      "Up to 5 team members",
      "Multi-groomer calendar",
      "Route optimization",
      "SMS reminders",
      "Advanced analytics",
    ],
  },
  {
    name: "Enterprise",
    price: 199,
    icon: Building2,
    description: "For large operations",
    features: [
      "Everything in Team",
      "Unlimited team members",
      "Custom reports",
      "Dedicated account manager",
      "Priority support",
      "API access",
    ],
  },
];

export default function BillingPage() {
  const { toast } = useToast();
  const [showChangePlanDialog, setShowChangePlanDialog] = React.useState(false);
  const [showCancelDialog, setShowCancelDialog] = React.useState(false);

  const handleChangePlan = (planName: string) => {
    setShowChangePlanDialog(false);
    toast({
      title: "Plan updated",
      description: `Your plan has been changed to ${planName}. Changes take effect immediately.`,
    });
  };

  const handleCancelSubscription = () => {
    setShowCancelDialog(false);
    toast({
      title: "Subscription canceled",
      description:
        "Your subscription will remain active until the end of the current billing period.",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing & Subscription"
        description="Manage your plan, payment method, and billing history"
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Plan */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Current Plan
                    <Badge variant="default">
                      {currentPlan.status === "active" ? "Active" : "Canceled"}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Your subscription renews on{" "}
                    {format(
                      new Date(currentPlan.currentPeriodEnd),
                      "MMMM d, yyyy"
                    )}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setShowChangePlanDialog(true)}
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Change Plan
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => setShowCancelDialog(true)}
                    >
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Cancel Subscription
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/10">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{currentPlan.name} Plan</p>
                    <p className="text-sm text-muted-foreground">
                      Billed monthly
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">
                    {formatCurrency(currentPlan.price)}
                  </p>
                  <p className="text-sm text-muted-foreground">per month</p>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <Button onClick={() => setShowChangePlanDialog(true)}>
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Change Plan
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/pricing">
                    Compare Plans
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Usage */}
          <Card>
            <CardHeader>
              <CardTitle>Usage This Period</CardTitle>
              <CardDescription>
                {format(new Date(currentPlan.currentPeriodStart), "MMM d")} –{" "}
                {format(new Date(currentPlan.currentPeriodEnd), "MMM d, yyyy")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <UsageBar
                label="Team Members"
                used={usage.teamMembers.used}
                limit={usage.teamMembers.limit}
                unit="members"
              />
              <UsageBar
                label="Appointments"
                used={usage.appointments.used}
                limit={usage.appointments.limit}
                unit="appointments"
              />
              <UsageBar
                label="SMS Reminders"
                used={usage.smsReminders.used}
                limit={usage.smsReminders.limit}
                unit="sent"
              />
              <UsageBar
                label="Storage"
                used={usage.storage.used}
                limit={usage.storage.limit}
                unit="GB"
              />
            </CardContent>
          </Card>

          {/* Billing History */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Billing History</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {invoiceHistory.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                        <Receipt className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{invoice.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(invoice.date), "MMMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">
                          {formatCurrency(invoice.amount)}
                        </p>
                        <Badge
                          variant={
                            invoice.status === "paid"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {invoice.status === "paid" ? "Paid" : "Upcoming"}
                        </Badge>
                      </div>
                      {invoice.status === "paid" && (
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="h-10 w-10 rounded bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Visa •••• 4242</p>
                  <p className="text-sm text-muted-foreground">Expires 12/26</p>
                </div>
                <Badge variant="outline">Default</Badge>
              </div>
              <Button variant="outline" className="w-full">
                Update Payment Method
              </Button>
            </CardContent>
          </Card>

          {/* Billing Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Billing Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Company</p>
                <p className="font-medium">Wag & Wash Grooming LLC</p>
              </div>
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium">billing@wagandwash.com</p>
              </div>
              <div>
                <p className="text-muted-foreground">Address</p>
                <p className="font-medium">
                  123 Main Street
                  <br />
                  San Francisco, CA 94102
                </p>
              </div>
              <Separator />
              <Button variant="outline" size="sm" className="w-full">
                Edit Billing Info
              </Button>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                href="/pricing"
                className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
              >
                <ArrowRight className="h-4 w-4" />
                Compare plans
              </Link>
              <Link
                href="/support"
                className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
              >
                <ArrowRight className="h-4 w-4" />
                Billing support
              </Link>
              <Link
                href="/terms"
                className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
              >
                <ArrowRight className="h-4 w-4" />
                Terms of service
              </Link>
            </CardContent>
          </Card>

          {/* Security Note */}
          <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 text-sm">
            <Shield className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Secure billing</p>
              <p className="text-muted-foreground">
                All payments are processed securely through Stripe. We never
                store your card details.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Change Plan Dialog */}
      <Dialog open={showChangePlanDialog} onOpenChange={setShowChangePlanDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Change Plan</DialogTitle>
            <DialogDescription>
              Choose a plan that fits your business. Changes take effect
              immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="grid md:grid-cols-3 gap-4 py-4">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isCurrent = plan.name === currentPlan.name;
              return (
                <Card
                  key={plan.name}
                  className={
                    isCurrent
                      ? "border-primary ring-1 ring-primary"
                      : "hover:border-primary/50 transition-colors"
                  }
                >
                  <CardContent className="pt-6">
                    <div className="text-center mb-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-bold">{plan.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {plan.description}
                      </p>
                      <p className="text-2xl font-bold mt-2">
                        ${plan.price}
                        <span className="text-sm font-normal text-muted-foreground">
                          /mo
                        </span>
                      </p>
                    </div>
                    <ul className="space-y-2 text-sm mb-4">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-2">
                          <CheckCircle className="h-3.5 w-3.5 text-green-600 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full"
                      variant={isCurrent ? "secondary" : "default"}
                      disabled={isCurrent}
                      onClick={() => handleChangePlan(plan.name)}
                    >
                      {isCurrent ? "Current Plan" : "Switch to " + plan.name}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel? You&apos;ll lose access to{" "}
              {currentPlan.name} features at the end of your billing period on{" "}
              {format(
                new Date(currentPlan.currentPeriodEnd),
                "MMMM d, yyyy"
              )}
              .
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/10">
              <h4 className="font-medium text-destructive mb-2">
                You&apos;ll lose access to:
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Multi-groomer calendar</li>
                <li>• Route optimization</li>
                <li>• SMS reminders</li>
                <li>• Advanced analytics</li>
                <li>• Priority support</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
            >
              Keep My Plan
            </Button>
            <Button variant="destructive" onClick={handleCancelSubscription}>
              Cancel Subscription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function UsageBar({
  label,
  used,
  limit,
  unit,
}: {
  label: string;
  used: number;
  limit: number;
  unit: string;
}) {
  const isUnlimited = !isFinite(limit);
  const percentage = isUnlimited ? 0 : Math.min((used / limit) * 100, 100);
  const isNearLimit = !isUnlimited && percentage >= 80;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">
          {used.toLocaleString()}{" "}
          {isUnlimited ? unit : `/ ${limit.toLocaleString()} ${unit}`}
          {isUnlimited && (
            <Badge variant="secondary" className="ml-2 text-xs">
              Unlimited
            </Badge>
          )}
        </span>
      </div>
      {!isUnlimited && (
        <Progress
          value={percentage}
          className={isNearLimit ? "[&>div]:bg-warning" : ""}
        />
      )}
    </div>
  );
}
