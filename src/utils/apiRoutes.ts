import { addBooking } from "@/services/bookingService";
import { get } from "http";

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
    },

    booking: {
        add: 'booking/create',
    },

    timeslot: {
        add: 'time-slot/create',
        getAll: 'time-slot/get-all',
        update: 'time-slot/update',
        delete: 'time-slot/delete',
    }
};