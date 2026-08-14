import { api_urls } from "@/utils/apiRoutes";
import { getData, deleteData, postFormData, putFormData } from "@/utils/apiHandler";
import { handleApiResponse } from "@/utils/common";

export const addCustomer = async (payload) => {
    const url = api_urls.baseUrl + api_urls.customer.add;
    const response = await postFormData(url, payload);
    return await handleApiResponse(response);
};

export const getAllCustomer = async () => {
    const url = api_urls.baseUrl + api_urls.customer.getAll;
    const response = await getData(url);
    return await handleApiResponse(response);
};

export const updateCustomer = async (id: string, payload) => {
    const url = `${api_urls.baseUrl}${api_urls.customer.update}/${id}`;
    const response = await putFormData(url, payload);
    return await handleApiResponse(response, 'UPDATE');
};

export const deleteCustomer = async (id: string) => {
    const url = `${api_urls.baseUrl}${api_urls.customer.delete}/${id}`;
    const response = await deleteData(url);
    return await handleApiResponse(response, 'DELETE');
};

export const getById = async (id: string) => {
    const url = `${api_urls.baseUrl}${api_urls.customer.getById}/${id}`;
    const response = await getData(url);
    return await handleApiResponse(response);
};






