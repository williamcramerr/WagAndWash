"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertTriangle, Trash2, XCircle, CheckCircle } from "lucide-react";

type DialogVariant = "danger" | "warning" | "confirm";

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: DialogVariant;
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
}

const variantConfig: Record<
  DialogVariant,
  {
    icon: React.ElementType;
    iconColor: string;
    iconBg: string;
    buttonVariant: "destructive" | "default" | "warning";
  }
> = {
  danger: {
    icon: Trash2,
    iconColor: "text-destructive",
    iconBg: "bg-destructive/10",
    buttonVariant: "destructive",
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-warning",
    iconBg: "bg-warning/10",
    buttonVariant: "warning",
  },
  confirm: {
    icon: CheckCircle,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    buttonVariant: "default",
  },
};

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "confirm",
  onConfirm,
  loading = false,
}: ConfirmationDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                config.iconBg
              )}
            >
              <Icon className={cn("h-5 w-5", config.iconColor)} />
            </div>
            <div className="flex-1">
              <AlertDialogTitle>{title}</AlertDialogTitle>
              <AlertDialogDescription className="mt-2">
                {description}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading || loading}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            disabled={isLoading || loading}
            className={cn(
              variant === "danger" && "bg-destructive text-destructive-foreground hover:bg-destructive/90",
              variant === "warning" && "bg-warning text-warning-foreground hover:bg-warning/90"
            )}
          >
            {isLoading || loading ? "Loading..." : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Hook for easy confirmation dialog usage
interface UseConfirmDialogOptions {
  title: string;
  description: string;
  confirmLabel?: string;
  variant?: DialogVariant;
}

export function useConfirmDialog() {
  const [dialogState, setDialogState] = React.useState<{
    open: boolean;
    options: UseConfirmDialogOptions;
    onConfirm: () => void | Promise<void>;
  }>({
    open: false,
    options: { title: "", description: "" },
    onConfirm: () => {},
  });

  const confirm = React.useCallback(
    (options: UseConfirmDialogOptions): Promise<boolean> => {
      return new Promise((resolve) => {
        setDialogState({
          open: true,
          options,
          onConfirm: () => {
            resolve(true);
          },
        });
      });
    },
    []
  );

  const handleOpenChange = React.useCallback((open: boolean) => {
    setDialogState((prev) => ({ ...prev, open }));
  }, []);

  const DialogComponent = React.useMemo(
    () => (
      <ConfirmationDialog
        open={dialogState.open}
        onOpenChange={handleOpenChange}
        title={dialogState.options.title}
        description={dialogState.options.description}
        confirmLabel={dialogState.options.confirmLabel}
        variant={dialogState.options.variant}
        onConfirm={dialogState.onConfirm}
      />
    ),
    [dialogState, handleOpenChange]
  );

  return { confirm, DialogComponent };
}
