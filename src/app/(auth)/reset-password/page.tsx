"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AuthCard } from "@/components/auth/auth-card";
import { PasswordInput } from "@/components/auth/password-input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, XCircle, ArrowRight } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = React.useState(false);
  const [isValidating, setIsValidating] = React.useState(true);
  const [isValidToken, setIsValidToken] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const token = searchParams.get("token");

  // Validate token on mount
  React.useEffect(() => {
    const validateToken = async () => {
      // Simulate token validation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo, token is valid if it exists and is longer than 10 chars
      // In real app, this would be an API call
      setIsValidToken(!!token && token.length > 10);
      setIsValidating(false);
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSuccess(true);
    toast({
      title: "Password reset successful",
      description: "You can now sign in with your new password.",
    });

    setIsLoading(false);
  };

  // Loading state while validating token
  if (isValidating) {
    return (
      <AuthCard title="Verifying..." description="Please wait while we verify your reset link.">
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AuthCard>
    );
  }

  // Invalid or expired token
  if (!isValidToken) {
    return (
      <AuthCard
        title="Invalid or expired link"
        description="This password reset link is no longer valid."
      >
        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
            <XCircle className="h-8 w-8 text-destructive" />
          </div>

          <p className="text-sm text-muted-foreground">
            The link may have expired or already been used. Please request a new
            password reset.
          </p>

          <Link href="/forgot-password">
            <Button className="w-full">Request new link</Button>
          </Link>
        </div>
      </AuthCard>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <AuthCard
        title="Password reset!"
        description="Your password has been successfully updated."
      >
        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-success/10 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>

          <p className="text-sm text-muted-foreground">
            You can now sign in with your new password.
          </p>

          <Link href="/login">
            <Button className="w-full">
              Continue to login
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </AuthCard>
    );
  }

  // Reset password form
  return (
    <AuthCard
      title="Set new password"
      description="Create a strong password for your account."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">New password</Label>
          <PasswordInput
            id="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            showStrength
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <PasswordInput
            id="confirmPassword"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
            className="h-11"
          />
          {confirmPassword && password !== confirmPassword && (
            <p className="text-sm text-destructive">Passwords don&apos;t match</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-11"
          disabled={isLoading || password !== confirmPassword}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Resetting...
            </>
          ) : (
            "Reset password"
          )}
        </Button>
      </form>
    </AuthCard>
  );
}
