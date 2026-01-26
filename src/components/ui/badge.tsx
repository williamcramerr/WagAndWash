import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success:
          "border-transparent bg-success text-success-foreground hover:bg-success/80",
        warning:
          "border-transparent bg-warning text-warning-foreground hover:bg-warning/80",
        // Appointment status variants
        pending:
          "border-transparent bg-status-pending/20 text-status-pending border-status-pending",
        confirmed:
          "border-transparent bg-status-confirmed/20 text-status-confirmed border-status-confirmed",
        "checked-in":
          "border-transparent bg-status-checked-in/20 text-status-checked-in border-status-checked-in",
        "in-progress":
          "border-transparent bg-status-in-progress/20 text-status-in-progress border-status-in-progress",
        completed:
          "border-transparent bg-status-completed/20 text-status-completed border-status-completed",
        "no-show":
          "border-transparent bg-status-no-show/20 text-status-no-show border-status-no-show",
        canceled:
          "border-transparent bg-status-canceled/20 text-status-canceled border-status-canceled",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
