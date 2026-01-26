"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import { type Appointment, groomers, getGroomerById, getClientById, getPetById } from "@/lib/mock-data";

interface MonthViewProps {
  currentDate: Date;
  appointments: Appointment[];
  selectedGroomers: string[];
  onDayClick: (date: Date) => void;
  onAppointmentClick: (appointment: Appointment) => void;
}

export function MonthView({
  currentDate,
  appointments,
  selectedGroomers,
  onDayClick,
  onAppointmentClick,
}: MonthViewProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.startTime);
      return isSameDay(aptDate, date);
    });
  };

  const activeGroomers =
    selectedGroomers.length > 0
      ? groomers.filter((g) => selectedGroomers.includes(g.id))
      : groomers.filter((g) => g.isActive);

  // Calculate stats for each day
  const getDayStats = (date: Date) => {
    const dayAppointments = getAppointmentsForDay(date);
    const revenue = dayAppointments
      .filter((a) => a.status === "completed")
      .reduce((sum, a) => sum + a.totalPrice, 0);
    const count = dayAppointments.length;
    const completed = dayAppointments.filter((a) => a.status === "completed").length;

    return { appointments: dayAppointments, revenue, count, completed };
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-7 bg-muted/50">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div
            key={day}
            className="py-3 text-center text-sm font-medium text-muted-foreground border-b"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const { appointments: dayAppointments, count } = getDayStats(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isCurrentDay = isToday(day);
          const hasAppointments = count > 0;

          // Get intensity for heatmap effect (0-4 levels)
          const intensity = Math.min(count, 4);

          return (
            <TooltipProvider key={day.toString()}>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onDayClick(day)}
                    className={cn(
                      "relative min-h-[100px] p-2 border-b border-r text-left transition-colors hover:bg-accent/50",
                      !isCurrentMonth && "bg-muted/30 text-muted-foreground",
                      isCurrentDay && "bg-primary/5",
                      index % 7 === 6 && "border-r-0"
                    )}
                  >
                    {/* Date Number */}
                    <div
                      className={cn(
                        "inline-flex items-center justify-center h-7 w-7 rounded-full text-sm font-medium",
                        isCurrentDay && "bg-primary text-primary-foreground"
                      )}
                    >
                      {format(day, "d")}
                    </div>

                    {/* Appointment Indicators */}
                    {hasAppointments && isCurrentMonth && (
                      <div className="mt-1 space-y-1">
                        {dayAppointments.slice(0, 3).map((apt) => {
                          const groomer = getGroomerById(apt.groomerId);
                          const client = getClientById(apt.clientId);

                          return (
                            <div
                              key={apt.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                onAppointmentClick(apt);
                              }}
                              className={cn(
                                "text-xs px-1.5 py-0.5 rounded truncate cursor-pointer transition-colors",
                                "hover:ring-2 hover:ring-primary/20"
                              )}
                              style={{
                                backgroundColor: `${groomer?.color}20`,
                                borderLeft: `3px solid ${groomer?.color}`,
                              }}
                            >
                              <span className="font-medium">
                                {format(new Date(apt.startTime), "HH:mm")}
                              </span>{" "}
                              {client?.firstName?.[0]}. {client?.lastName}
                            </div>
                          );
                        })}
                        {count > 3 && (
                          <div className="text-xs text-muted-foreground pl-1.5">
                            +{count - 3} more
                          </div>
                        )}
                      </div>
                    )}

                    {/* Intensity indicator */}
                    {hasAppointments && isCurrentMonth && (
                      <div
                        className={cn(
                          "absolute bottom-1 right-1 h-2 w-2 rounded-full",
                          intensity === 1 && "bg-green-300",
                          intensity === 2 && "bg-yellow-300",
                          intensity === 3 && "bg-orange-300",
                          intensity >= 4 && "bg-red-300"
                        )}
                      />
                    )}
                  </button>
                </TooltipTrigger>
                {hasAppointments && (
                  <TooltipContent side="right" className="max-w-xs">
                    <div className="space-y-2">
                      <p className="font-semibold">
                        {format(day, "EEEE, MMMM d")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {count} appointment{count !== 1 ? "s" : ""} scheduled
                      </p>
                      <div className="space-y-1">
                        {dayAppointments.slice(0, 5).map((apt) => {
                          const client = getClientById(apt.clientId);
                          const pet = getPetById(apt.services[0]?.petId);
                          return (
                            <div
                              key={apt.id}
                              className="text-xs flex items-center gap-2"
                            >
                              <span className="font-medium">
                                {format(new Date(apt.startTime), "HH:mm")}
                              </span>
                              <span>
                                {client?.firstName} - {pet?.name}
                              </span>
                            </div>
                          );
                        })}
                        {count > 5 && (
                          <p className="text-xs text-muted-foreground">
                            +{count - 5} more
                          </p>
                        )}
                      </div>
                    </div>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between p-3 bg-muted/30 border-t">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-green-300" />
            <span>1-2 appointments</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-yellow-300" />
            <span>3 appointments</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-orange-300" />
            <span>4 appointments</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-red-300" />
            <span>5+ appointments</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {activeGroomers.slice(0, 4).map((groomer) => (
            <div key={groomer.id} className="flex items-center gap-1 text-xs">
              <div
                className="h-3 w-3 rounded"
                style={{ backgroundColor: groomer.color }}
              />
              <span>{groomer.firstName}</span>
            </div>
          ))}
          {activeGroomers.length > 4 && (
            <span className="text-xs text-muted-foreground">
              +{activeGroomers.length - 4} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
