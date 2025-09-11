import { api_urls } from "@/utils/apiRoutes";
import { getData, deleteData, postFormData, putFormData } from "@/utils/apiHandler";
import { handleApiResponse } from "@/utils/common";

export const addGuest = async (payload: any) => {
    const url = api_urls.baseUrl + api_urls.guest.add;
    const response = await postFormData(url, payload);
    return await handleApiResponse(response);
};

export const getAllGuest = async () => {
    const url = api_urls.baseUrl + api_urls.guest.getAll;
    const response = await getData(url);
    return await handleApiResponse(response);
};

export const updateGuest = async (id: string, payload: any) => {
    const url = `${api_urls.baseUrl}${api_urls.guest.update}/${id}`;
    const response = await putFormData(url, payload);
    return await handleApiResponse(response, 'UPDATE');
};

export const deleteGuest = async (id: string) => {
    const url = `${api_urls.baseUrl}${api_urls.guest.delete}/${id}`;
    const response = await deleteData(url);
    return await handleApiResponse(response, 'DELETE');
};

export const getById = async (id: string) => {
    const url = `${api_urls.baseUrl}${api_urls.guest.getById}/${id}`;
    const response = await getData(url);
    return await handleApiResponse(response);
};








