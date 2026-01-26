"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { Clock, ArrowRight, ArrowLeft, Copy } from "lucide-react";

const defaultHours = [
  { day: "Monday", enabled: true, start: "09:00", end: "17:00" },
  { day: "Tuesday", enabled: true, start: "09:00", end: "17:00" },
  { day: "Wednesday", enabled: true, start: "09:00", end: "17:00" },
  { day: "Thursday", enabled: true, start: "09:00", end: "17:00" },
  { day: "Friday", enabled: true, start: "09:00", end: "17:00" },
  { day: "Saturday", enabled: true, start: "10:00", end: "16:00" },
  { day: "Sunday", enabled: false, start: "10:00", end: "14:00" },
];

const timeOptions = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00",
];

const formatTime = (time: string) => {
  const [hour] = time.split(":");
  const h = parseInt(hour);
  if (h === 0) return "12:00 AM";
  if (h === 12) return "12:00 PM";
  if (h > 12) return `${h - 12}:00 PM`;
  return `${h}:00 AM`;
};

export default function OnboardingHoursPage() {
  const router = useRouter();
  const [hours, setHours] = React.useState(defaultHours);

  const updateDay = (index: number, field: string, value: string | boolean) => {
    setHours((prev) =>
      prev.map((h, i) => (i === index ? { ...h, [field]: value } : h))
    );
  };

  const copyToAll = (index: number) => {
    const sourceDay = hours[index];
    setHours((prev) =>
      prev.map((h) => ({
        ...h,
        start: sourceDay.start,
        end: sourceDay.end,
      }))
    );
  };

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
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>Business Hours</CardTitle>
          </div>
          <CardDescription>
            Set your regular operating hours. Clients will only be able to book
            during these times.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Hours Grid */}
          <div className="space-y-3">
            {hours.map((day, index) => (
              <div
                key={day.day}
                className={`flex items-center gap-4 p-3 rounded-lg border transition-colors ${
                  day.enabled ? "bg-card" : "bg-muted/30"
                }`}
              >
                <Switch
                  checked={day.enabled}
                  onCheckedChange={(checked) => updateDay(index, "enabled", checked)}
                />
                <div className="w-28">
                  <span className={`font-medium ${!day.enabled && "text-muted-foreground"}`}>
                    {day.day}
                  </span>
                </div>

                {day.enabled ? (
                  <>
                    <Select
                      value={day.start}
                      onValueChange={(value) => updateDay(index, "start", value)}
                    >
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={time} value={time}>
                            {formatTime(time)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <span className="text-muted-foreground">to</span>

                    <Select
                      value={day.end}
                      onValueChange={(value) => updateDay(index, "end", value)}
                    >
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={time} value={time}>
                            {formatTime(time)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToAll(index)}
                      title="Copy to all days"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <span className="text-muted-foreground italic">Closed</span>
                )}
              </div>
            ))}
          </div>

          {/* Quick templates */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setHours((prev) =>
                  prev.map((h) => ({
                    ...h,
                    enabled: h.day !== "Sunday",
                    start: "09:00",
                    end: "17:00",
                  }))
                );
              }}
            >
              9-5 Weekdays
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setHours((prev) =>
                  prev.map((h) => ({
                    ...h,
                    enabled: true,
                    start: "08:00",
                    end: "18:00",
                  }))
                );
              }}
            >
              8-6 Every Day
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setHours((prev) =>
                  prev.map((h) => ({
                    ...h,
                    enabled: h.day !== "Saturday" && h.day !== "Sunday",
                    start: "07:00",
                    end: "19:00",
                  }))
                );
              }}
            >
              Early Bird (7-7)
            </Button>
          </div>

          {/* Skip option */}
          <div className="flex items-center justify-between pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              You can adjust these later in Settings
            </p>
            <Button variant="ghost" size="sm" onClick={() => router.push("/onboarding/invite-team")}>
              Skip for now
            </Button>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/onboarding/services")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button onClick={() => router.push("/onboarding/invite-team")}>
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
