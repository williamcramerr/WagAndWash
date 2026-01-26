"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthCard } from "@/components/auth/auth-card";
import { PasswordInput } from "@/components/auth/password-input";
import { SocialLoginButtons, Divider } from "@/components/auth/social-login-buttons";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, ArrowRight } from "lucide-react";

type LoginMethod = "password" | "magic-link";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [loginMethod, setLoginMethod] = React.useState<LoginMethod>("password");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(false);
  const [magicLinkSent, setMagicLinkSent] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (loginMethod === "magic-link") {
      setMagicLinkSent(true);
      toast({
        title: "Magic link sent!",
        description: `Check your email at ${email} for a login link.`,
      });
    } else {
      // Simulate successful login
      toast({
        title: "Welcome back!",
        description: "You've been logged in successfully.",
      });
      router.push("/");
    }

    setIsLoading(false);
  };

  const handleSocialLogin = (provider: string) => {
    toast({
      title: `${provider} login`,
      description: "Social login would redirect to OAuth provider.",
    });
  };

  if (magicLinkSent) {
    return (
      <AuthCard
        title="Check your email"
        description={`We sent a magic link to ${email}`}
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">
            Click the link in your email to sign in. The link will expire in 10 minutes.
          </p>
          <Button
            variant="ghost"
            className="text-sm"
            onClick={() => {
              setMagicLinkSent(false);
              setLoginMethod("password");
            }}
          >
            Use a different method
          </Button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to your Wag & Wash account"
      footer={
        <p>
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-primary hover:underline"
          >
            Sign up free
          </Link>
        </p>
      }
    >
      <SocialLoginButtons
        onGoogleClick={() => handleSocialLogin("Google")}
        onAppleClick={() => handleSocialLogin("Apple")}
        isLoading={isLoading}
      />

      <Divider text="or continue with email" />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="h-11"
          />
        </div>

        {loginMethod === "password" ? (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <PasswordInput
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="h-11"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label
                htmlFor="remember"
                className="text-sm font-normal text-muted-foreground cursor-pointer"
              >
                Remember me for 30 days
              </Label>
            </div>
          </>
        ) : null}

        <Button
          type="submit"
          className="w-full h-11"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {loginMethod === "magic-link" ? "Sending link..." : "Signing in..."}
            </>
          ) : (
            <>
              {loginMethod === "magic-link" ? "Send magic link" : "Sign in"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="w-full text-sm text-muted-foreground"
          onClick={() =>
            setLoginMethod(loginMethod === "password" ? "magic-link" : "password")
          }
          disabled={isLoading}
        >
          {loginMethod === "password"
            ? "Sign in with magic link instead"
            : "Sign in with password instead"}
        </Button>
      </form>
    </AuthCard>
  );
}
