"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCard } from "@/components/auth/auth-card";
import { PasswordInput } from "@/components/auth/password-input";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Users,
  Building2,
  ArrowRight,
} from "lucide-react";

type InviteState = "loading" | "valid" | "invalid" | "accepted";

interface InviteDetails {
  businessName: string;
  inviterName: string;
  role: string;
  email: string;
}

export default function AcceptInvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const token = searchParams.get("token");

  const [state, setState] = React.useState<InviteState>("loading");
  const [inviteDetails, setInviteDetails] = React.useState<InviteDetails | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    password: "",
  });

  // Validate invite on mount
  React.useEffect(() => {
    const validateInvite = async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (!token || token.length < 10) {
        setState("invalid");
        return;
      }

      // Mock invite details
      setInviteDetails({
        businessName: "Pampered Paws Grooming",
        inviterName: "Sarah",
        role: "Groomer",
        email: "newteam@example.com",
      });
      setState("valid");
    };

    validateInvite();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setState("accepted");
    toast({
      title: "Welcome to the team!",
      description: `You've joined ${inviteDetails?.businessName}.`,
    });

    setIsSubmitting(false);
  };

  // Loading state
  if (state === "loading") {
    return (
      <AuthCard
        title="Loading invitation..."
        description="Please wait while we verify your invite."
      >
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AuthCard>
    );
  }

  // Invalid invite
  if (state === "invalid") {
    return (
      <AuthCard
        title="Invalid invitation"
        description="This invitation link is no longer valid."
      >
        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
            <XCircle className="h-8 w-8 text-destructive" />
          </div>

          <p className="text-sm text-muted-foreground">
            The invitation may have expired or already been used. Please contact
            the person who invited you for a new link.
          </p>

          <Link href="/login">
            <Button variant="outline" className="w-full">
              Go to login
            </Button>
          </Link>
        </div>
      </AuthCard>
    );
  }

  // Accepted state
  if (state === "accepted") {
    return (
      <AuthCard
        title="You're in!"
        description={`Welcome to ${inviteDetails?.businessName}`}
      >
        <div className="text-center space-y-6">
          <div className="w-20 h-20 mx-auto bg-success/10 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
            <CheckCircle className="h-10 w-10 text-success" />
          </div>

          <div className="space-y-2">
            <p className="font-medium text-foreground">
              Your account has been created
            </p>
            <p className="text-sm text-muted-foreground">
              You can now access the {inviteDetails?.businessName} dashboard as a{" "}
              {inviteDetails?.role}.
            </p>
          </div>

          <Button onClick={() => router.push("/")} className="w-full">
            Go to dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </AuthCard>
    );
  }

  // Valid invite - show form
  return (
    <AuthCard
      title="Join the team"
      description="Complete your profile to accept the invitation."
    >
      {/* Invite details */}
      <div className="p-4 rounded-lg bg-muted/50 border space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-sm">{inviteDetails?.businessName}</p>
            <p className="text-xs text-muted-foreground">
              {inviteDetails?.inviterName} invited you as {inviteDetails?.role}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name fields */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              placeholder="Jane"
              value={formData.firstName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, firstName: e.target.value }))
              }
              required
              disabled={isSubmitting}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              placeholder="Smith"
              value={formData.lastName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, lastName: e.target.value }))
              }
              required
              disabled={isSubmitting}
              className="h-11"
            />
          </div>
        </div>

        {/* Email (read-only) */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={inviteDetails?.email || ""}
            disabled
            className="h-11 bg-muted"
          />
          <p className="text-xs text-muted-foreground">
            This is the email your invitation was sent to
          </p>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Create password</Label>
          <PasswordInput
            id="password"
            placeholder="Create a strong password"
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
            required
            disabled={isSubmitting}
            showStrength
            className="h-11"
          />
        </div>

        <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              <Users className="mr-2 h-4 w-4" />
              Accept invitation
            </>
          )}
        </Button>
      </form>

      <p className="text-xs text-center text-muted-foreground">
        By accepting, you agree to our{" "}
        <Link href="/terms" className="text-primary hover:underline">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-primary hover:underline">
          Privacy Policy
        </Link>
      </p>
    </AuthCard>
  );
}
