"use client";
import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  EventInput,
  DateSelectArg,
  EventClickArg,
  EventContentArg,
} from "@fullcalendar/core";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import AddGuestBookings from "../guest/addBooking";
import { getBooking } from "@/services/bookingService";


interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
  };
}

const Calendar: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [eventTitle, setEventTitle] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventLevel, setEventLevel] = useState("");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();

  const [open, setOpen] = useState(false);
  const [bookings, setBookings] = useState([]);

  const calendarsEvents = {
    Danger: "danger",
    Success: "success",
    Primary: "primary",
    Warning: "warning",
  };

  const fetchAllBookings = async () => {
    try {
      const response = await getBooking();

      const formattedEvents = response?.map((booking: any) => {
        const startISO = new Date(booking.startTime).toISOString();
        const endISO = booking.endTime ? new Date(booking.endTime).toISOString() : null;

        return {
          id: booking._id,
          title: `${booking.customerId?.name || "Guest"}`,
          start: booking.startTime,
          end: booking.endTime,
          extendedProps: {
            calendar: booking.customerId?.role === "member" ? "Member" : "Guest",
            bookedBy: booking.customerId?.name,
            course: booking.course?.name,
            notes: booking.specialInfo,
          },
        };
      });
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchAllBookings();
  }, [open]);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetModalFields();
    setEventStartDate(selectInfo.startStr);
    setEventEndDate(selectInfo.endStr || selectInfo.startStr);
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEvent(event as unknown as CalendarEvent);
    setEventTitle(event.title);
    setEventStartDate(event.start?.toISOString().split("T")[0] || "");
    setEventEndDate(event.end?.toISOString().split("T")[0] || "");
    setEventLevel(event.extendedProps.calendar);
    openModal();
  };

  const handleAddOrUpdateEvent = () => {
    if (selectedEvent) {
      // Update existing event
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === selectedEvent.id
            ? {
              ...event,
              title: eventTitle,
              start: eventStartDate,
              end: eventEndDate,
              extendedProps: { calendar: eventLevel },
            }
            : event
        )
      );
    } else {
      // Add new event
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        title: eventTitle,
        start: eventStartDate,
        end: eventEndDate,
        allDay: true,
        extendedProps: { calendar: eventLevel },
      };
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    }
    closeModal();
    resetModalFields();
  };

  const resetModalFields = () => {
    setEventTitle("");
    setEventStartDate("");
    setEventEndDate("");
    setEventLevel("");
    setSelectedEvent(null);
  };

  const handleOpenAdd = () => {
    setOpen(true);
  };

  const handleCloseAdd = () => {
    setOpen(false);
  };

  return (
    <>
      <AddGuestBookings open={open} handleClose={handleCloseAdd} />
      <div className="rounded-2xl border  border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="custom-calendar">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next addEventButton",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events}
            selectable={true}
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            customButtons={{
              addEventButton: {
                text: "Guest Booking +",
                // click: openModal,
                click: handleOpenAdd,

              },
            }}
          />
        </div>
      </div>
    </>
  );
};

const renderEventContent = (eventInfo: EventContentArg) => {
  const { bookedBy, course, calendar } = eventInfo.event.extendedProps;

  // Set color based on role
  let borderColor = "border-gray-300"; // default
  let bgColor = "bg-white";

  if (calendar === "Member") {
    borderColor = "border-green-500";
    bgColor = "bg-green-50";
  } else if (calendar === "Guest") {
    borderColor = "border-blue-500";
    bgColor = "bg-blue-50";
  }

  const formatTime = (date: Date | null) => {
    if (!date) return "";
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  return (
    <div className={`w-full overflow-hidden rounded border-l-4 ${borderColor} ${bgColor} p-1 shadow-sm`}>
      <div className="font-semibold text-sm truncate text-gray-800">
        {bookedBy || "Guest"}
      </div>
      <div className="text-xs text-gray-500">
        {formatTime(eventInfo.event.start)} - {formatTime(eventInfo.event.end)}
      </div>
      {course && (
        <div className="text-xs italic text-gray-400 truncate">{course}</div>
      )}
    </div>
  );
};

export default Calendar;
