"use client";

import * as React from "react";
import { cn, formatCurrency } from "@/lib/utils";

interface PriceDisplayProps {
  amount: number;
  originalAmount?: number;
  currency?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showCents?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg font-semibold",
  xl: "text-2xl font-bold",
};

export function PriceDisplay({
  amount,
  originalAmount,
  size = "md",
  showCents = true,
  className,
}: PriceDisplayProps) {
  const formattedAmount = showCents
    ? formatCurrency(amount)
    : `$${Math.floor(amount)}`;

  const hasDiscount = originalAmount && originalAmount > amount;

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className={cn(sizeClasses[size], "text-foreground tabular-nums")}>
        {formattedAmount}
      </span>
      {hasDiscount && (
        <span className="text-muted-foreground line-through text-sm tabular-nums">
          {formatCurrency(originalAmount)}
        </span>
      )}
    </span>
  );
}

interface PriceSummaryProps {
  items: Array<{
    label: string;
    amount: number;
    isDiscount?: boolean;
    isTotal?: boolean;
  }>;
  className?: string;
}

export function PriceSummary({ items, className }: PriceSummaryProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item, index) => (
        <div
          key={index}
          className={cn(
            "flex items-center justify-between",
            item.isTotal && "border-t pt-2 mt-2 font-semibold"
          )}
        >
          <span
            className={cn(
              "text-sm",
              item.isTotal ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {item.label}
          </span>
          <span
            className={cn(
              "tabular-nums",
              item.isDiscount && "text-success",
              item.isTotal && "text-lg"
            )}
          >
            {item.isDiscount && "-"}
            {formatCurrency(Math.abs(item.amount))}
          </span>
        </div>
      ))}
    </div>
  );
}

interface TipSelectorProps {
  baseAmount: number;
  selectedTip: number;
  onTipChange: (tip: number) => void;
  presets?: number[];
  className?: string;
}

export function TipSelector({
  baseAmount,
  selectedTip,
  onTipChange,
  presets = [15, 20, 25],
  className,
}: TipSelectorProps) {
  const [customMode, setCustomMode] = React.useState(false);

  const handlePresetClick = (percentage: number) => {
    const tipAmount = Math.round(baseAmount * (percentage / 100) * 100) / 100;
    onTipChange(tipAmount);
    setCustomMode(false);
  };

  const currentPercentage = baseAmount > 0 ? Math.round((selectedTip / baseAmount) * 100) : 0;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Add Tip</span>
        {selectedTip > 0 && (
          <span className="text-sm text-muted-foreground">
            {formatCurrency(selectedTip)} ({currentPercentage}%)
          </span>
        )}
      </div>
      <div className="flex gap-2">
        {presets.map((percentage) => (
          <button
            key={percentage}
            type="button"
            onClick={() => handlePresetClick(percentage)}
            className={cn(
              "flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors",
              currentPercentage === percentage && !customMode
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            {percentage}%
          </button>
        ))}
        <button
          type="button"
          onClick={() => setCustomMode(true)}
          className={cn(
            "flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors",
            customMode
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          Custom
        </button>
      </div>
      {customMode && (
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">$</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={selectedTip || ""}
            onChange={(e) => onTipChange(parseFloat(e.target.value) || 0)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="Enter custom amount"
          />
        </div>
      )}
    </div>
  );
}
