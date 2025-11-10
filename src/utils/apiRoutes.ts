import Tournament from "@/app/(admin)/(others-pages)/tournament/page";
import { getById } from "@/services/customerService";
import { dailySalesReport, monthlySalesReport } from "@/services/reportService";
import { useDateInput } from "@heroui/react";
import { report } from "process";

export const api_urls = {
    baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}`,
    imageBaseUrl: `${process.env.NEXT_PUBLIC_API_IMG_URL}`,
    course: {
        add: 'courses/create',
        getAll: 'courses/get-all',
        update: 'courses/update',
        delete: 'courses/delete',
    },

    plan: {
        add: 'plan/create',
        getAll: 'plan/get-all',
        update: 'plan/update',
        delete: 'plan/delete',
    },

    member: {
        add: 'member/create',
        getAll: 'member/get-all',
        update: 'member/update',
        delete: 'member/delete',
        getById: 'member',
    },

    customer: {
        add: 'customer/create',
        getAll: 'customer/get-all',
        update: 'customer/update',
        delete: 'customer/delete',
        getById: 'customer',
    },

    guest: {
        add: 'guest/create',
        getAll: 'guest/get-all',
        update: 'guest/update',
        delete: 'guest/delete',
        getById: 'guest',
    },

    staff: {
        add: 'staff/create',
        getAll: 'staff/get-all',
        update: 'staff/update',
        delete: 'staff/delete',
        getById: 'staff',
        updateShift: 'staff/update-workingshift-status',
        usedateStatus: 'staff/update-status'
    },

    booking: {
        add: 'booking/create',
        getAll: 'booking/get-all',
        updateGuestBooking: 'booking/update-guest',
        cancelGuestBooking: 'booking/cancel-guest',
        assignSlot: "booking/assign-slot",
        bookingById: "booking",
        updateBookingAssignSlot: "booking/update-assign-slot",
        cancelBookingAssignSlot: "booking/cancel-assign-slot",
        cancelBookingOfGuest: "booking/cancel-booking-guest",
        assignCaddy: "booking/assign-caddy"
    },

    timeslot: {
        add: 'time-slot/create',
        getAll: 'time-slot/get-all',
        update: 'time-slot/update',
        delete: 'time-slot/delete',
        getByStartAndCourse: 'time-slot/slots',
        getAllIndividualSlots: 'time-slot/all-slots',
        getIndividualSlotsByDate: 'time-slot/by-date',
        getAllIndividualSlotsByTimeSlotId: 'time-slot/by-timeslot',
        getAllIndividualSlotsByCourseId: 'time-slot/by-course',
    },

    tournament: {
        add: 'tournament/create',
        getById: 'tournament/get',
        getAll: 'tournament/get-all',
        update: 'tournament/update',
        delete: 'tournament/delete',
        assignPlayer: 'tournament/addPlayerOnTournament',
        changeStatus: 'tournament/update-status'
    },

    player: {
        add: 'player/create',
        getAll: 'player/get-all',
        update: 'player/update',
        delete: 'player/delete',
        getByNumber: 'player/by-phone'
    },

    proshop: {
        add: "products/create",
        getAll: "products",
        getById: "products",
        update: "products/update",
        updateStock: "products/update-stock",
        delete: "products/delete",
    },

    rental: {
        create: "rental/create",
        getAll: "rental/get-all",
        getById: "rental/get",
        update: "rental/update",
        return: "rental/return",
        cancel: "rental/cancel",
        getByStatus: "rental/status",
        makePayment: "rental/make-payment"
    },

    user: {
        login: "auth/login",
        getProfile: "auth/profile"
    },

    payment: {
        create: "payment/create",
        getAll: "payment/get-all",
        getById: "payment",
        update: "payment/update",
        delete: "payment/delete",
    },

    report: {
        monthlySales: "reports/monthly-sales",
        dailySales: "reports/daily-sales",

        dailySalesRental: "reports/daily-sales-rental",
        monthlySalesRental: "reports/monthly-sales-rental",
    }
};