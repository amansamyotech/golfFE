import { api_urls } from "@/utils/apiRoutes";
import { getData, deleteData, postData, putData } from "@/utils/apiHandler";
import { handleApiResponse } from "@/utils/common";





export const addTimeSlot = async (payload: any) => {
    const url = api_urls.baseUrl + api_urls.timeslot.add;
    const response = await postData(url, payload);
    return await handleApiResponse(response);
};

export const getTimeSlot = async () => {
    const url = api_urls.baseUrl + api_urls.timeslot.getAll;
    const response = await getData(url);
    return await handleApiResponse(response);
};

export const updateTimeSlot = async (id: string, payload: any) => {
    const url = `${api_urls.baseUrl}${api_urls.timeslot.update}/${id}`;
    const response = await putData(url, payload);
    return handleApiResponse(response, 'UPDATE');
};

export const deleteTimeSlot = async (id: string) => {
    const url = `${api_urls.baseUrl}${api_urls.timeslot.delete}/${id}`;
    const response = await deleteData(url);
    return handleApiResponse(response, 'DELETE');
};








