"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  LayoutGrid,
  List,
} from "lucide-react";
import { format, addDays, addWeeks, addMonths, subDays, subWeeks, subMonths } from "date-fns";
import { groomers, getActiveGroomers } from "@/lib/mock-data";

type CalendarView = "day" | "week" | "month";

interface CalendarHeaderProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  selectedGroomers: string[];
  onGroomerChange: (groomers: string[]) => void;
}

export function CalendarHeader({
  currentDate,
  onDateChange,
  view,
  onViewChange,
  selectedGroomers,
  onGroomerChange,
}: CalendarHeaderProps) {
  const activeGroomers = getActiveGroomers();

  const handlePrevious = () => {
    switch (view) {
      case "day":
        onDateChange(subDays(currentDate, 1));
        break;
      case "week":
        onDateChange(subWeeks(currentDate, 1));
        break;
      case "month":
        onDateChange(subMonths(currentDate, 1));
        break;
    }
  };

  const handleNext = () => {
    switch (view) {
      case "day":
        onDateChange(addDays(currentDate, 1));
        break;
      case "week":
        onDateChange(addWeeks(currentDate, 1));
        break;
      case "month":
        onDateChange(addMonths(currentDate, 1));
        break;
    }
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  const getDateDisplay = () => {
    switch (view) {
      case "day":
        return format(currentDate, "EEEE, MMMM d, yyyy");
      case "week":
        const weekStart = currentDate;
        const weekEnd = addDays(weekStart, 6);
        if (weekStart.getMonth() === weekEnd.getMonth()) {
          return `${format(weekStart, "MMMM d")} - ${format(weekEnd, "d, yyyy")}`;
        }
        return `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`;
      case "month":
        return format(currentDate, "MMMM yyyy");
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        {/* Navigation */}
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" onClick={handlePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Button variant="outline" size="sm" onClick={handleToday}>
          Today
        </Button>

        {/* Date display */}
        <h2 className="text-xl font-semibold">{getDateDisplay()}</h2>
      </div>

      <div className="flex items-center gap-3">
        {/* Groomer filter */}
        <Select
          value={selectedGroomers.length === 0 ? "all" : selectedGroomers[0]}
          onValueChange={(value) =>
            onGroomerChange(value === "all" ? [] : [value])
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Groomers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Groomers</SelectItem>
            {activeGroomers.map((groomer) => (
              <SelectItem key={groomer.id} value={groomer.id}>
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: groomer.color }}
                  />
                  {groomer.firstName} {groomer.lastName}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* View switcher */}
        <div className="flex items-center rounded-md border bg-muted p-1">
          <Button
            variant={view === "day" ? "secondary" : "ghost"}
            size="sm"
            className="h-7 px-2"
            onClick={() => onViewChange("day")}
          >
            Day
          </Button>
          <Button
            variant={view === "week" ? "secondary" : "ghost"}
            size="sm"
            className="h-7 px-2"
            onClick={() => onViewChange("week")}
          >
            Week
          </Button>
          <Button
            variant={view === "month" ? "secondary" : "ghost"}
            size="sm"
            className="h-7 px-2"
            onClick={() => onViewChange("month")}
          >
            Month
          </Button>
        </div>
      </div>
    </div>
  );
}
