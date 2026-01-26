"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/auth/auth-card";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Mail,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

type VerificationState = "verifying" | "success" | "error" | "pending";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const token = searchParams.get("token");
  const email = searchParams.get("email") || "your email";

  const [state, setState] = React.useState<VerificationState>(
    token ? "verifying" : "pending"
  );
  const [isResending, setIsResending] = React.useState(false);

  // Verify token on mount
  React.useEffect(() => {
    if (!token) return;

    const verifyEmail = async () => {
      // Simulate verification
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // For demo, verification succeeds if token exists
      setState("success");
    };

    verifyEmail();
  }, [token]);

  const handleResend = async () => {
    setIsResending(true);

    // Simulate resend
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Verification email sent",
      description: "Please check your inbox for the new verification link.",
    });

    setIsResending(false);
  };

  // Verifying state
  if (state === "verifying") {
    return (
      <AuthCard
        title="Verifying your email..."
        description="Please wait while we confirm your email address."
      >
        <div className="flex flex-col items-center py-8 space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">This will not take long</p>
        </div>
      </AuthCard>
    );
  }

  // Success state
  if (state === "success") {
    return (
      <AuthCard
        title="Email verified!"
        description="Your email has been successfully verified."
      >
        <div className="text-center space-y-6">
          <div className="w-20 h-20 mx-auto bg-success/10 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
            <CheckCircle className="h-10 w-10 text-success" />
          </div>

          <div className="space-y-2">
            <p className="font-medium text-foreground">Welcome to Wag & Wash!</p>
            <p className="text-sm text-muted-foreground">
              Your account is now active. Let&apos;s set up your grooming business.
            </p>
          </div>

          <Button onClick={() => router.push("/onboarding")} className="w-full">
            Continue to setup
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </AuthCard>
    );
  }

  // Error state
  if (state === "error") {
    return (
      <AuthCard
        title="Verification failed"
        description="We couldn't verify your email address."
      >
        <div className="text-center space-y-6">
          <div className="w-20 h-20 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
            <XCircle className="h-10 w-10 text-destructive" />
          </div>

          <p className="text-sm text-muted-foreground">
            The verification link may have expired or is invalid. Please request
            a new verification email.
          </p>

          <Button onClick={handleResend} disabled={isResending} className="w-full">
            {isResending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Resend verification email
              </>
            )}
          </Button>

          <Link href="/login">
            <Button variant="ghost" className="w-full">
              Back to login
            </Button>
          </Link>
        </div>
      </AuthCard>
    );
  }

  // Pending state (no token - waiting for user to check email)
  return (
    <AuthCard
      title="Verify your email"
      description="We've sent a verification link to your email."
    >
      <div className="text-center space-y-6">
        <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
          <Mail className="h-10 w-10 text-primary" />
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Click the link in your email to verify your account. The link expires
            in 24 hours.
          </p>
          <p className="text-sm font-medium text-foreground">
            Sent to: {decodeURIComponent(email)}
          </p>
        </div>

        <div className="space-y-3">
          <Button
            variant="outline"
            onClick={handleResend}
            disabled={isResending}
            className="w-full"
          >
            {isResending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Resend email
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground">
            Did not receive the email? Check your spam folder or try a different
            email address.
          </p>
        </div>

        <Link href="/login">
          <Button variant="ghost" size="sm">
            Back to login
          </Button>
        </Link>
      </div>
    </AuthCard>
  );
}
