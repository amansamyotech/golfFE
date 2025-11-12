"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Typography,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getBooking } from "@/services/bookingService";
interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  extendedProps: {
    calendar: string;
    bookedBy: string;
    course: string;
    notes?: string;
    bookingType?: string;
    status?: string;
  };
}

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [filter, setFilter] = useState("All");
  const [selectedDayEvents, setSelectedDayEvents] = useState<CalendarEvent[]>(
    []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const calendarRef = useRef<FullCalendar>(null);

  // ---- Fetch Bookings ----
  const fetchAllBookings = async () => {
    try {
      const response = await getBooking() as any[];

      const formattedEvents = response?.flatMap((booking) => {
        const customer = booking.customerId || {};
        const isMember = customer?.role === "member";
        const courseName = booking.course?.name;

        return (booking.slotIds || []).map((slot) => {
          const start = new Date(slot.start.replace(" ", "T"));
          const end = new Date(slot.end.replace(" ", "T"));

          return {
            id: slot._id,
            title: `${customer?.name || "Guest"}`,
            start,
            end,
            extendedProps: {
              calendar: isMember ? "Member" : "Guest",
              bookedBy: customer?.name,
              course: courseName,
              notes: booking.specialInfo,
              bookingType: booking.bookingType,
              status: booking.bookingStatus,
            },
          };
        });
      });

      setEvents(formattedEvents || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  useEffect(() => {
    fetchAllBookings();
  }, []);

  // ---- Filtering ----
  const filteredEvents = useMemo(() => {
    if (filter === "All") return events;
    return events.filter(
      (e) => e.extendedProps.calendar.toLowerCase() === filter.toLowerCase()
    );
  }, [events, filter]);

  // ---- Event Content ----
  const renderEventContent = React.useCallback((eventInfo: any) => {
    const { bookedBy, course, calendar } = eventInfo.event.extendedProps;
    const borderColor =
      calendar === "Member" ? "border-green-500" : "border-blue-500";
    const textColor =
      calendar === "Member" ? "text-green-700" : "text-blue-700";

    const formatTime = (date: Date | null) =>
      date
        ? new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }).format(date)
        : "";

    return (
      <div
        className={`w-full overflow-hidden rounded border ${borderColor} bg-white p-1 shadow-sm hover:shadow-md transition-all duration-200`}
      >
        <div className={`font-semibold text-sm truncate ${textColor}`}>
          {bookedBy || "Guest"}
        </div>
        <div className="text-xs text-gray-500">
          {formatTime(eventInfo.event.start)} -{" "}
          {formatTime(eventInfo.event.end)}
        </div>
        {course && (
          <div className="text-xs italic text-gray-400 truncate">{course}</div>
        )}
      </div>
    );
  }, []);

  // ---- Handle More Link ----
  const handleMoreClick = (info: any) => {
    const dayEvents = info.allSegs.map((seg: any) => seg.event);
    setSelectedDayEvents(dayEvents);
    setIsModalOpen(true);
    return "popover";
  };


  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Tee Time Calendar
        </h2>
        <div className="space-x-2">
          {["All", "Member", "Guest"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-1.5 rounded-full border text-sm ${filter === type
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* ---- Calendar ---- */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          height="auto"
          expandRows={true}
          dayMaxEventRows={3}
          moreLinkClick={handleMoreClick}
          events={filteredEvents}
          eventContent={renderEventContent}
        />
      </div>

      {/* ---- Modal ---- */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pr: 2 }}>
          <Typography variant="h6" fontWeight="600">
            Bookings for Selected Day
          </Typography>
          <IconButton
            aria-label="close"
            onClick={() => setIsModalOpen(false)}
            sx={{
              color: (theme) => theme.palette.grey[500]
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {selectedDayEvents.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No bookings found for this date.
            </Typography>
          ) : (
            <Box
              sx={{
                maxHeight: 400,
                // overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
                mt: 1,
              }}
            >
              {selectedDayEvents.map((ev) => {
                const isMember = ev.extendedProps.calendar === "Member";
                return (
                  <Box
                    key={ev.id}
                    sx={{
                      border: `1px solid ${isMember ? "#22c55e" : "#3b82f6"}`,
                      borderRadius: 2,
                      p: 1.5,
                      bgcolor: "background.paper",
                      boxShadow: 1,

                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      fontWeight="600"
                      color={isMember ? "success.main" : "primary.main"}
                    >
                      {ev.extendedProps.bookedBy}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {ev.extendedProps.course}
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                      {new Intl.DateTimeFormat("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      }).format(ev.start)}{" "}
                      -{" "}
                      {new Intl.DateTimeFormat("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      }).format(ev.end)}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Calendar;

