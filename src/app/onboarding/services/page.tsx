"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scissors,
  ArrowRight,
  ArrowLeft,
  Plus,
  X,
  Check,
} from "lucide-react";

const templateServices = [
  { id: "full-groom", name: "Full Groom", price: 65, duration: 90, selected: true },
  { id: "bath-brush", name: "Bath & Brush", price: 35, duration: 45, selected: true },
  { id: "nail-trim", name: "Nail Trim", price: 15, duration: 15, selected: true },
  { id: "de-shed", name: "De-Shed Treatment", price: 55, duration: 75, selected: false },
  { id: "puppy-groom", name: "Puppy First Groom", price: 45, duration: 60, selected: false },
  { id: "teeth-clean", name: "Teeth Cleaning", price: 12, duration: 10, selected: false },
];

export default function OnboardingServicesPage() {
  const router = useRouter();
  const [services, setServices] = React.useState(templateServices);
  const [showCustom, setShowCustom] = React.useState(false);
  const [customName, setCustomName] = React.useState("");
  const [customPrice, setCustomPrice] = React.useState("");
  const [customDuration, setCustomDuration] = React.useState("");

  const toggleService = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, selected: !s.selected } : s))
    );
  };

  const addCustomService = () => {
    if (customName && customPrice && customDuration) {
      setServices((prev) => [
        ...prev,
        {
          id: `custom-${Date.now()}`,
          name: customName,
          price: parseFloat(customPrice),
          duration: parseInt(customDuration),
          selected: true,
        },
      ]);
      setCustomName("");
      setCustomPrice("");
      setCustomDuration("");
      setShowCustom(false);
    }
  };

  const removeService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const selectedCount = services.filter((s) => s.selected).length;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Scissors className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>Your Services</CardTitle>
          </div>
          <CardDescription>
            Select the services you offer or add your own. You can customize pricing and
            add more services later.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Service Templates */}
          <div className="space-y-3">
            {services.map((service) => (
              <motion.div
                key={service.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  service.selected ? "bg-primary/5 border-primary/20" : "bg-muted/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Switch
                    checked={service.selected}
                    onCheckedChange={() => toggleService(service.id)}
                  />
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <p className="text-sm text-muted-foreground">
                      ${service.price} • {service.duration} min
                    </p>
                  </div>
                </div>
                {service.id.startsWith("custom-") && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeService(service.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </motion.div>
            ))}
          </div>

          {/* Add Custom Service */}
          <AnimatePresence>
            {showCustom ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 p-4 border rounded-lg bg-muted/30"
              >
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-3 md:col-span-1 space-y-2">
                    <Label>Service Name</Label>
                    <Input
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="e.g., Cat Grooming"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Price ($)</Label>
                    <Input
                      type="number"
                      value={customPrice}
                      onChange={(e) => setCustomPrice(e.target.value)}
                      placeholder="50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Duration (min)</Label>
                    <Input
                      type="number"
                      value={customDuration}
                      onChange={(e) => setCustomDuration(e.target.value)}
                      placeholder="60"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowCustom(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addCustomService}>
                    <Check className="h-4 w-4 mr-2" />
                    Add Service
                  </Button>
                </div>
              </motion.div>
            ) : (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowCustom(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Custom Service
              </Button>
            )}
          </AnimatePresence>

          {/* Summary */}
          <div className="flex items-center justify-between pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              {selectedCount} service{selectedCount !== 1 ? "s" : ""} selected
            </p>
            <Button variant="ghost" size="sm" onClick={() => router.push("/onboarding/hours")}>
              Skip for now
            </Button>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/onboarding/business")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button onClick={() => router.push("/onboarding/hours")}>
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
