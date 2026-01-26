"use client";

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Dog, Cat, AlertTriangle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PetAvatarProps {
  name: string;
  imageUrl?: string;
  species: "dog" | "cat";
  hasSafetyFlags?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
};

const iconSizes = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-8 w-8",
};

const badgeSizes = {
  sm: "h-3 w-3 -right-0.5 -bottom-0.5",
  md: "h-4 w-4 -right-0.5 -bottom-0.5",
  lg: "h-5 w-5 -right-1 -bottom-1",
  xl: "h-6 w-6 -right-1 -bottom-1",
};

export function PetAvatar({
  name,
  imageUrl,
  species,
  hasSafetyFlags,
  size = "md",
  className,
}: PetAvatarProps) {
  const SpeciesIcon = species === "dog" ? Dog : Cat;
  const initials = name.slice(0, 2).toUpperCase();

  const avatar = (
    <div className={cn("relative inline-block", className)}>
      <Avatar className={cn(sizeClasses[size], "border-2 border-background shadow-sm")}>
        <AvatarImage src={imageUrl} alt={name} />
        <AvatarFallback className="bg-secondary">
          <SpeciesIcon className={cn(iconSizes[size], "text-secondary-foreground")} />
        </AvatarFallback>
      </Avatar>

      {/* Species indicator */}
      <span
        className={cn(
          "absolute flex items-center justify-center rounded-full border-2 border-background",
          species === "dog" ? "bg-primary" : "bg-accent",
          badgeSizes[size]
        )}
      >
        <SpeciesIcon className="h-2/3 w-2/3 text-white" />
      </span>

      {/* Safety flag indicator */}
      {hasSafetyFlags && (
        <span
          className={cn(
            "absolute -top-1 -right-1 flex items-center justify-center rounded-full bg-destructive",
            size === "sm" ? "h-3 w-3" : size === "md" ? "h-4 w-4" : size === "lg" ? "h-5 w-5" : "h-6 w-6"
          )}
        >
          <AlertTriangle className="h-2/3 w-2/3 text-white" />
        </span>
      )}
    </div>
  );

  if (hasSafetyFlags) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{avatar}</TooltipTrigger>
          <TooltipContent>
            <p className="flex items-center gap-1 text-destructive">
              <AlertTriangle className="h-3 w-3" />
              Safety flags - review before appointment
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return avatar;
}

interface PetAvatarGroupProps {
  pets: Array<{
    id: string;
    name: string;
    imageUrl?: string;
    species: "dog" | "cat";
    hasSafetyFlags?: boolean;
  }>;
  max?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PetAvatarGroup({
  pets,
  max = 3,
  size = "md",
  className,
}: PetAvatarGroupProps) {
  const visiblePets = pets.slice(0, max);
  const remainingCount = pets.length - max;

  return (
    <div className={cn("flex -space-x-2", className)}>
      {visiblePets.map((pet) => (
        <PetAvatar
          key={pet.id}
          name={pet.name}
          imageUrl={pet.imageUrl}
          species={pet.species}
          hasSafetyFlags={pet.hasSafetyFlags}
          size={size}
          className="ring-2 ring-background"
        />
      ))}
      {remainingCount > 0 && (
        <div
          className={cn(
            "flex items-center justify-center rounded-full bg-muted text-muted-foreground font-medium ring-2 ring-background",
            sizeClasses[size]
          )}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}
