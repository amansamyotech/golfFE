import { api_urls } from "@/utils/apiRoutes";
import { getData, deleteData, postFormData, putFormData, postData, putData } from "@/utils/apiHandler";
import { handleApiResponse } from "@/utils/common";

export const addPayment = async (payload) => {
    const url = api_urls.baseUrl + api_urls.payment.create;
    const response = await postData(url, payload);
    return await handleApiResponse(response);
};

export const getAllPayments = async () => {
    const url = api_urls.baseUrl + api_urls.payment.getAll;
    const response = await getData(url);
    return await handleApiResponse(response);
};

export const getPaymentById = async (id) => {
    const url = `${api_urls.baseUrl}${api_urls.payment.getById}/${id}`;
    const response = await getData(url);
    return await handleApiResponse(response);
};

export const updatePayment = async (id, payload) => {
    const url = `${api_urls.baseUrl}${api_urls.payment.update}/${id}`;
    const response = await putData(url, payload);
    return await handleApiResponse(response);
};

export const deletePayment = async (id) => {
    const url = `${api_urls.baseUrl}${api_urls.payment.delete}/${id}`;
    const response = await deleteData(url);
    return await handleApiResponse(response);
};
