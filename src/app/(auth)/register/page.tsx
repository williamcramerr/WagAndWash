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
import { Loader2, ArrowRight, Building2, User, Sparkles } from "lucide-react";

type AccountType = "business" | "individual";

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [step, setStep] = React.useState(1);
  const [accountType, setAccountType] = React.useState<AccountType | null>(null);

  // Form state
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    businessName: "",
    agreeToTerms: false,
    agreeToMarketing: false,
  });

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1 && !accountType) {
      return;
    }

    if (step === 1) {
      setStep(2);
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast({
      title: "Account created!",
      description: "Welcome to Wag & Wash. Let's set up your business.",
    });

    router.push("/onboarding");
    setIsLoading(false);
  };

  const handleSocialLogin = (provider: string) => {
    toast({
      title: `${provider} signup`,
      description: "Social signup would redirect to OAuth provider.",
    });
  };

  // Step 1: Choose account type
  if (step === 1) {
    return (
      <AuthCard
        title="Create your account"
        description="Start your 14-day free trial. No credit card required."
        footer={
          <p>
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            What best describes you?
          </p>

          <div className="grid gap-3">
            <button
              type="button"
              onClick={() => setAccountType("business")}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                accountType === "business"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  accountType === "business" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}>
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Grooming Business</p>
                  <p className="text-sm text-muted-foreground">
                    Salon, mobile grooming, or multi-location operation
                  </p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setAccountType("individual")}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                accountType === "individual"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  accountType === "individual" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}>
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Independent Groomer</p>
                  <p className="text-sm text-muted-foreground">
                    Solo groomer working independently
                  </p>
                </div>
              </div>
            </button>
          </div>

          <Button
            onClick={() => accountType && setStep(2)}
            className="w-full h-11"
            disabled={!accountType}
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <Divider text="or sign up with" />

          <SocialLoginButtons
            onGoogleClick={() => handleSocialLogin("Google")}
            onAppleClick={() => handleSocialLogin("Apple")}
          />
        </div>
      </AuthCard>
    );
  }

  // Step 2: Account details
  return (
    <AuthCard
      title="Set up your account"
      description={
        accountType === "business"
          ? "Tell us about your grooming business"
          : "Create your groomer profile"
      }
      footer={
        <p>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name fields */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              placeholder="Jane"
              value={formData.firstName}
              onChange={(e) => updateFormData("firstName", e.target.value)}
              required
              disabled={isLoading}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              placeholder="Smith"
              value={formData.lastName}
              onChange={(e) => updateFormData("lastName", e.target.value)}
              required
              disabled={isLoading}
              className="h-11"
            />
          </div>
        </div>

        {/* Business name (only for business accounts) */}
        {accountType === "business" && (
          <div className="space-y-2">
            <Label htmlFor="businessName">Business name</Label>
            <Input
              id="businessName"
              placeholder="Pampered Paws Grooming"
              value={formData.businessName}
              onChange={(e) => updateFormData("businessName", e.target.value)}
              required
              disabled={isLoading}
              className="h-11"
            />
          </div>
        )}

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => updateFormData("email", e.target.value)}
            required
            disabled={isLoading}
            className="h-11"
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            placeholder="Create a strong password"
            value={formData.password}
            onChange={(e) => updateFormData("password", e.target.value)}
            required
            disabled={isLoading}
            showStrength
            className="h-11"
          />
        </div>

        {/* Terms checkbox */}
        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={formData.agreeToTerms}
              onCheckedChange={(checked) =>
                updateFormData("agreeToTerms", checked as boolean)
              }
              className="mt-0.5"
            />
            <Label
              htmlFor="terms"
              className="text-sm font-normal text-muted-foreground cursor-pointer leading-relaxed"
            >
              I agree to the{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </Label>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="marketing"
              checked={formData.agreeToMarketing}
              onCheckedChange={(checked) =>
                updateFormData("agreeToMarketing", checked as boolean)
              }
              className="mt-0.5"
            />
            <Label
              htmlFor="marketing"
              className="text-sm font-normal text-muted-foreground cursor-pointer leading-relaxed"
            >
              Send me tips, product updates, and grooming industry news
            </Label>
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full h-11"
          disabled={isLoading || !formData.agreeToTerms}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Start free trial
            </>
          )}
        </Button>

        {/* Back button */}
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => setStep(1)}
          disabled={isLoading}
        >
          Back
        </Button>
      </form>
    </AuthCard>
  );
}
