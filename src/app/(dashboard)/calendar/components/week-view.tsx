"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { AppointmentBlock } from "./appointment-block";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  format,
  startOfWeek,
  addDays,
  isSameDay,
  isToday,
  differenceInMinutes,
  setHours,
  setMinutes,
} from "date-fns";
import type { Appointment } from "@/lib/mock-data/types";
import { getActiveGroomers, getGroomerById } from "@/lib/mock-data";

interface WeekViewProps {
  currentDate: Date;
  appointments: Appointment[];
  selectedGroomers: string[];
  onAppointmentClick?: (appointment: Appointment) => void;
}

const HOUR_HEIGHT = 60; // pixels per hour
const START_HOUR = 7; // 7 AM
const END_HOUR = 20; // 8 PM

export function WeekView({
  currentDate,
  appointments,
  selectedGroomers,
  onAppointmentClick,
}: WeekViewProps) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday start
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);
  const groomers = selectedGroomers.length > 0
    ? selectedGroomers.map(id => getGroomerById(id)).filter(Boolean)
    : getActiveGroomers();

  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Scroll to current time on mount
  React.useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();
    if (scrollRef.current && currentHour >= START_HOUR) {
      const scrollTop = (currentHour - START_HOUR) * HOUR_HEIGHT - 100;
      scrollRef.current.scrollTop = Math.max(0, scrollTop);
    }
  }, []);

  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter((apt) =>
      isSameDay(new Date(apt.startTime), date)
    );
  };

  const getAppointmentStyle = (appointment: Appointment): React.CSSProperties => {
    const start = new Date(appointment.startTime);
    const end = new Date(appointment.endTime);
    const startMinutes = start.getHours() * 60 + start.getMinutes();
    const duration = differenceInMinutes(end, start);

    const top = ((startMinutes - START_HOUR * 60) / 60) * HOUR_HEIGHT;
    const height = (duration / 60) * HOUR_HEIGHT - 4; // -4 for gap

    return {
      position: "absolute",
      top: `${top}px`,
      height: `${Math.max(height, 30)}px`,
      left: "4px",
      right: "4px",
    };
  };

  // Get current time position
  const now = new Date();
  const nowTop =
    ((now.getHours() * 60 + now.getMinutes() - START_HOUR * 60) / 60) *
    HOUR_HEIGHT;

  return (
    <div className="flex flex-col h-[calc(100vh-220px)] border rounded-lg bg-card overflow-hidden">
      {/* Header */}
      <div className="flex border-b bg-muted/30">
        {/* Time column header */}
        <div className="w-16 shrink-0 border-r" />

        {/* Day headers */}
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className={cn(
              "flex-1 py-3 text-center border-r last:border-r-0",
              isToday(day) && "bg-primary/5"
            )}
          >
            <div className="text-xs text-muted-foreground uppercase">
              {format(day, "EEE")}
            </div>
            <div
              className={cn(
                "text-xl font-semibold",
                isToday(day) &&
                  "bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center mx-auto"
              )}
            >
              {format(day, "d")}
            </div>
          </div>
        ))}
      </div>

      {/* Time grid */}
      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="flex">
          {/* Time labels */}
          <div className="w-16 shrink-0 border-r">
            {hours.map((hour) => (
              <div
                key={hour}
                className="h-[60px] pr-2 text-right text-xs text-muted-foreground pt-[-6px]"
                style={{ height: HOUR_HEIGHT }}
              >
                {format(setHours(new Date(), hour), "h a")}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map((day) => {
            const dayAppointments = getAppointmentsForDay(day);
            const filteredAppointments = selectedGroomers.length > 0
              ? dayAppointments.filter(apt => selectedGroomers.includes(apt.groomerId))
              : dayAppointments;

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "flex-1 relative border-r last:border-r-0",
                  isToday(day) && "bg-primary/5"
                )}
              >
                {/* Hour lines */}
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="border-b border-dashed border-border/50"
                    style={{ height: HOUR_HEIGHT }}
                  />
                ))}

                {/* Now indicator */}
                {isToday(day) && nowTop > 0 && nowTop < hours.length * HOUR_HEIGHT && (
                  <div
                    className="absolute left-0 right-0 z-10"
                    style={{ top: nowTop }}
                  >
                    <div className="relative">
                      <div className="absolute -left-1 w-2 h-2 rounded-full bg-destructive" />
                      <div className="h-0.5 bg-destructive" />
                    </div>
                  </div>
                )}

                {/* Appointments */}
                {filteredAppointments.map((appointment) => (
                  <AppointmentBlock
                    key={appointment.id}
                    appointment={appointment}
                    style={getAppointmentStyle(appointment)}
                    compact
                    onClick={() => onAppointmentClick?.(appointment)}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
