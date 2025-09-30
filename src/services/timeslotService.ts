import { api_urls } from "@/utils/apiRoutes";
import { getData, deleteData, postData, putData } from "@/utils/apiHandler";
import { handleApiResponse } from "@/utils/common";

export interface TimeSlotPayload {
    start_date: string; // ISO date string
    end_date: string;   // ISO date string
    slot_time_minutes: number;
    buffer_time_minutes: number;
    ground_opening_time: string; // e.g., "08:00"
    ground_closing_time: string; // e.g., "20:00"
    status: 'available' | 'booked';
}

export const addTimeSlot = async (payload: TimeSlotPayload) => {
    const url = api_urls.baseUrl + api_urls.timeslot.add;
    const response = await postData(url, payload);
    return await handleApiResponse(response);
};

export const getTimeSlot = async () => {
    const url = api_urls.baseUrl + api_urls.timeslot.getAll;
    const response = await getData(url);
    return await handleApiResponse(response);
};

export const updateTimeSlot = async (id: string, payload: TimeSlotPayload) => {
    const url = `${api_urls.baseUrl}${api_urls.timeslot.update}/${id}`;
    const response = await putData(url, payload);
    return handleApiResponse(response, 'UPDATE');
};

export const deleteTimeSlot = async (id: string) => {
    const url = `${api_urls.baseUrl}${api_urls.timeslot.delete}/${id}`;
    const response = await deleteData(url);
    return handleApiResponse(response, 'DELETE');
};

export const getTimeSlotByStartAndCourse = async (startDate: string, endDate: string, courseId: string) => {
    const url =
        `${api_urls.baseUrl}${api_urls.timeslot.getByStartAndCourse}` +
        `?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}&courseId=${encodeURIComponent(courseId)}`;
    const response = await getData(url);
    return await handleApiResponse(response);
};

export const getAllIndividualSlots = async () => {
    const url = api_urls.baseUrl + api_urls.timeslot.getAllIndividualSlots;
    const response = await getData(url);
    return await handleApiResponse(response);
};

export const getIndividualSlotsByDate = async (date) => {
    const url = `${api_urls.baseUrl}${api_urls.timeslot.getIndividualSlotsByDate}/${date}`;
    const response = await getData(url);
    return await handleApiResponse(response);
};













