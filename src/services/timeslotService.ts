import { api_urls } from "@/utils/apiRoutes";
import { getData, deleteData, postData, putData } from "@/utils/apiHandler";
import { handleApiResponse } from "@/utils/common";

export interface TimeSlotPayload {
    // start_date: string;
    // end_date: string;
    // slot_time_minutes: number;
    // buffer_time_minutes: number;
    // ground_opening_time: string;
    // ground_closing_time: string;
    // status: 'available' | 'booked';
    // total_slot_time?: number | string;

    _id?: string;
    start_date?: string;
    course?: { _id: string; name: string } | any;
    slot_time_hours?: number | string;
    slot_time_minutes?: number | string;
    weekday_opening_time?: string | any;
    weekday_closing_time?: string | any;
    weekend_opening_time?: string | any;
    weekend_closing_time?: string | any;
    total_slot_time?: number | string;
    buffer_time?: number | string;
    status?: 'available' | 'booked';
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

export const getIndividualSlotsByDate = async (date, id) => {
    const url = `${api_urls.baseUrl}${api_urls.timeslot.getIndividualSlotsByDate}/${date}/${id}`;
    const response = await getData(url);
    return await handleApiResponse(response);
};

export const getIndividualSlotsByTimeSlotId = async (id: string) => {
    const url = `${api_urls.baseUrl}${api_urls.timeslot.getAllIndividualSlotsByTimeSlotId}/${id}`;
    const response = await getData(url);
    return await handleApiResponse(response);
}

export const getIndividualSlotsByCourseId = async (id: string) => {
    const url = `${api_urls.baseUrl}${api_urls.timeslot.getAllIndividualSlotsByCourseId}/${id}`;
    const response = await getData(url);
    return await handleApiResponse(response);
}













