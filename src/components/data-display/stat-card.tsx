"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    label?: string;
  };
  format?: "number" | "currency" | "percentage";
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  format = "number",
  className,
}: StatCardProps) {
  const formattedValue = React.useMemo(() => {
    if (typeof value === "string") return value;

    switch (format) {
      case "currency":
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);
      case "percentage":
        return `${value}%`;
      default:
        return new Intl.NumberFormat("en-US").format(value);
    }
  }, [value, format]);

  const TrendIcon = trend
    ? trend.value > 0
      ? TrendingUp
      : trend.value < 0
      ? TrendingDown
      : Minus
    : null;

  const trendColor = trend
    ? trend.value > 0
      ? "text-success"
      : trend.value < 0
      ? "text-destructive"
      : "text-muted-foreground"
    : "";

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{formattedValue}</p>
            {(description || trend) && (
              <div className="flex items-center gap-2 text-sm">
                {trend && TrendIcon && (
                  <span className={cn("flex items-center gap-1", trendColor)}>
                    <TrendIcon className="h-4 w-4" />
                    <span className="font-medium">
                      {trend.value > 0 ? "+" : ""}
                      {trend.value}%
                    </span>
                  </span>
                )}
                {description && (
                  <span className="text-muted-foreground">{description}</span>
                )}
                {trend?.label && (
                  <span className="text-muted-foreground">{trend.label}</span>
                )}
              </div>
            )}
          </div>
          {Icon && (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-6 w-6 text-primary" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface StatCardGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function StatCardGrid({
  children,
  columns = 4,
  className,
}: StatCardGridProps) {
  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-4", gridCols[columns], className)}>
      {children}
    </div>
  );
}

// Mini stat for inline displays
interface MiniStatProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export function MiniStat({ label, value, icon: Icon, trend, className }: MiniStatProps) {
  const trendColor =
    trend === "up"
      ? "text-success"
      : trend === "down"
      ? "text-destructive"
      : "text-muted-foreground";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {Icon && (
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={cn("text-sm font-semibold", trendColor)}>{value}</p>
      </div>
    </div>
  );
}
