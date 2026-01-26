"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon, Camera } from "lucide-react";

interface ImageUploadProps {
  value?: string;
  onChange?: (value: string) => void;
  onRemove?: () => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  aspectRatio?: "square" | "portrait" | "landscape";
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  disabled,
  className,
  placeholder = "Upload image",
  aspectRatio = "square",
}: ImageUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const aspectClasses = {
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    landscape: "aspect-video",
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a preview URL (in real app, would upload to server)
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange?.(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange?.(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (value) {
    return (
      <div className={cn("relative group", aspectClasses[aspectRatio], className)}>
        <img
          src={value}
          alt="Uploaded"
          className="w-full h-full object-cover rounded-lg"
        />
        {!disabled && (
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={handleClick}
            >
              <Camera className="h-4 w-4 mr-1" />
              Change
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={onRemove}
            >
              <X className="h-4 w-4 mr-1" />
              Remove
            </Button>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative border-2 border-dashed rounded-lg transition-all cursor-pointer",
        aspectClasses[aspectRatio],
        isDragging
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
        <div className="p-3 rounded-full bg-muted">
          {isDragging ? (
            <Upload className="h-6 w-6" />
          ) : (
            <ImageIcon className="h-6 w-6" />
          )}
        </div>
        <p className="text-sm font-medium">
          {isDragging ? "Drop image here" : placeholder}
        </p>
        <p className="text-xs">PNG, JPG up to 5MB</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
}
