"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { AppointmentBlock } from "./appointment-block";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  format,
  isSameDay,
  isToday,
  differenceInMinutes,
  setHours,
} from "date-fns";
import type { Appointment } from "@/lib/mock-data/types";
import { getActiveGroomers, getGroomerById, type Groomer } from "@/lib/mock-data";

interface DayViewProps {
  currentDate: Date;
  appointments: Appointment[];
  selectedGroomers: string[];
  onAppointmentClick?: (appointment: Appointment) => void;
}

const HOUR_HEIGHT = 60;
const START_HOUR = 7;
const END_HOUR = 20;

export function DayView({
  currentDate,
  appointments,
  selectedGroomers,
  onAppointmentClick,
}: DayViewProps) {
  const hours = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);
  const groomers = selectedGroomers.length > 0
    ? selectedGroomers.map(id => getGroomerById(id)).filter(Boolean) as Groomer[]
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

  const dayAppointments = appointments.filter((apt) =>
    isSameDay(new Date(apt.startTime), currentDate)
  );

  const getAppointmentsForGroomer = (groomerId: string) => {
    return dayAppointments.filter((apt) => apt.groomerId === groomerId);
  };

  const getAppointmentStyle = (appointment: Appointment): React.CSSProperties => {
    const start = new Date(appointment.startTime);
    const end = new Date(appointment.endTime);
    const startMinutes = start.getHours() * 60 + start.getMinutes();
    const duration = differenceInMinutes(end, start);

    const top = ((startMinutes - START_HOUR * 60) / 60) * HOUR_HEIGHT;
    const height = (duration / 60) * HOUR_HEIGHT - 4;

    return {
      position: "absolute",
      top: `${top}px`,
      height: `${Math.max(height, 40)}px`,
      left: "4px",
      right: "4px",
    };
  };

  // Get current time position
  const now = new Date();
  const nowTop =
    ((now.getHours() * 60 + now.getMinutes() - START_HOUR * 60) / 60) *
    HOUR_HEIGHT;
  const showNowLine = isToday(currentDate) && nowTop > 0 && nowTop < hours.length * HOUR_HEIGHT;

  return (
    <div className="flex flex-col h-[calc(100vh-220px)] border rounded-lg bg-card overflow-hidden">
      {/* Header with groomer columns */}
      <div className="flex border-b bg-muted/30">
        {/* Time column header */}
        <div className="w-16 shrink-0 border-r" />

        {/* Groomer headers */}
        {groomers.map((groomer) => (
          <div
            key={groomer.id}
            className="flex-1 py-3 px-2 border-r last:border-r-0"
          >
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={groomer.imageUrl} />
                <AvatarFallback style={{ backgroundColor: groomer.color }}>
                  {groomer.firstName[0]}
                  {groomer.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">
                  {groomer.firstName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {getAppointmentsForGroomer(groomer.id).length} appointments
                </p>
              </div>
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
                className="pr-2 text-right text-xs text-muted-foreground"
                style={{ height: HOUR_HEIGHT }}
              >
                {format(setHours(new Date(), hour), "h a")}
              </div>
            ))}
          </div>

          {/* Groomer columns */}
          {groomers.map((groomer) => {
            const groomerAppointments = getAppointmentsForGroomer(groomer.id);

            return (
              <div
                key={groomer.id}
                className="flex-1 relative border-r last:border-r-0 min-w-[150px]"
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
                {showNowLine && (
                  <div
                    className="absolute left-0 right-0 z-10"
                    style={{ top: nowTop }}
                  >
                    <div className="h-0.5 bg-destructive" />
                  </div>
                )}

                {/* Appointments */}
                {groomerAppointments.map((appointment) => (
                  <AppointmentBlock
                    key={appointment.id}
                    appointment={appointment}
                    style={getAppointmentStyle(appointment)}
                    onClick={() => onAppointmentClick?.(appointment)}
                  />
                ))}
              </div>
            );
          })}
        </div>

        {/* Now indicator dot */}
        {showNowLine && (
          <div
            className="absolute left-14 w-2 h-2 rounded-full bg-destructive z-20"
            style={{ top: nowTop - 4 }}
          />
        )}
      </ScrollArea>
    </div>
  );
}
