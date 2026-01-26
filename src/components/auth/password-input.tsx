"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Check, X } from "lucide-react";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  showStrength?: boolean;
}

interface StrengthCheck {
  label: string;
  test: (password: string) => boolean;
}

const strengthChecks: StrengthCheck[] = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "Contains uppercase", test: (p) => /[A-Z]/.test(p) },
  { label: "Contains lowercase", test: (p) => /[a-z]/.test(p) },
  { label: "Contains number", test: (p) => /[0-9]/.test(p) },
];

export function PasswordInput({
  showStrength = false,
  className,
  value,
  onChange,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState("");

  const password = (value as string) ?? internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
    onChange?.(e);
  };

  const passedChecks = strengthChecks.filter((check) => check.test(password));
  const strengthPercentage = (passedChecks.length / strengthChecks.length) * 100;

  const getStrengthColor = () => {
    if (strengthPercentage <= 25) return "bg-destructive";
    if (strengthPercentage <= 50) return "bg-warning";
    if (strengthPercentage <= 75) return "bg-amber-500";
    return "bg-success";
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          className={cn("pr-10", className)}
          value={value}
          onChange={handleChange}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Eye className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="sr-only">
            {showPassword ? "Hide password" : "Show password"}
          </span>
        </Button>
      </div>

      {showStrength && password.length > 0 && (
        <div className="space-y-2">
          {/* Strength bar */}
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-300",
                getStrengthColor()
              )}
              style={{ width: `${strengthPercentage}%` }}
            />
          </div>

          {/* Requirements checklist */}
          <ul className="grid grid-cols-2 gap-1 text-xs">
            {strengthChecks.map((check) => {
              const passed = check.test(password);
              return (
                <li
                  key={check.label}
                  className={cn(
                    "flex items-center gap-1 transition-colors",
                    passed ? "text-success" : "text-muted-foreground"
                  )}
                >
                  {passed ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <X className="h-3 w-3" />
                  )}
                  {check.label}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
