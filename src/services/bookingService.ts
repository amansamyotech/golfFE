import { api_urls } from "@/utils/apiRoutes";
import { getData, postData, postFormData, putFormData, deleteData, putData } from "@/utils/apiHandler";
import { handleApiResponse } from "@/utils/common";

interface BookingPayload {
    userId: string;
    timeSlotId: string;
    date: string;
    status: 'confirmed' | 'cancelled' | 'pending';
}

export const addBooking = async (payload: BookingPayload) => {
    const url = api_urls.baseUrl + api_urls.booking.add;
    const response = await postData(url, payload);
    return await handleApiResponse(response);
};

export const guestBooking = async (payload: BookingPayload) => {
    const url = api_urls.baseUrl + api_urls.booking.add;
    const response = await postFormData(url, payload);
    return await handleApiResponse(response);
};

export const getBooking = async () => {
    const url = api_urls.baseUrl + api_urls.booking.getAll;
    const response = await getData(url);
    return await handleApiResponse(response);
};

export const updateGuestBooking = async (id, payload: BookingPayload) => {
    const url = `${api_urls.baseUrl}${api_urls.booking.updateGuestBooking}/${id}`;
    const response = await putFormData(url, payload);
    return await handleApiResponse(response, 'UPDATE');
};

export const cancelGuestBooking = async (id) => {
    const url = `${api_urls.baseUrl}${api_urls.booking.cancelGuestBooking}/${id}`;
    const response = await deleteData(url);
    return await handleApiResponse(response, 'DELETE');
};

export const assignSlot = async (id, payload: BookingPayload) => {
    const url = `${api_urls.baseUrl}${api_urls.booking.assignSlot}/${id}`;
    const response = await postData(url, payload);
    return await handleApiResponse(response);
};

export const getBookingByID = async (id) => {
    const url = `${api_urls.baseUrl}${api_urls.booking.bookingById}/${id}`;
    const response = await getData(url);
    return await handleApiResponse(response);
};

export const updateBookingSlotService = async (
    bookingId: string,
    previousSlotId: string,
    newSlotId: string
) => {
    const url = `${api_urls.baseUrl}${api_urls.booking.updateBookingAssignSlot}/${bookingId}`;
    const payload = {
        previousSlotId,
        newSlotId
    }
    const response = await putData(url, payload);
    return await handleApiResponse(response, 'UPDATE');
};


















