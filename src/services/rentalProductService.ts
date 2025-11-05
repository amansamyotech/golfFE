import { api_urls } from "@/utils/apiRoutes";
import {
    getData,
    postData,
    putData,
    deleteData
} from "@/utils/apiHandler";
import { handleApiResponse } from "@/utils/common";

export const createRental = async (payload) => {
    const url = api_urls.baseUrl + api_urls.rental.create;
    const response = await postData(url, payload);
    return await handleApiResponse(response);
};

export const getAllRentals = async () => {
    const url = api_urls.baseUrl + api_urls.rental.getAll;
    const response = await getData(url);
    return await handleApiResponse(response);
};

export const getRentalById = async (id) => {
    const url = `${api_urls.baseUrl + api_urls.rental.getById}/${id}`;
    const response = await getData(url);
    return await handleApiResponse(response);
};

export const updateRental = async (id, payload) => {
    const url = `${api_urls.baseUrl + api_urls.rental.update}/${id}`;
    const response = await putData(url, payload);
    return await handleApiResponse(response, 'UPDATE');
};

export const returnRental = async (id, payload) => {
    const url = `${api_urls.baseUrl + api_urls.rental.return}/${id}`;
    const response = await putData(url, payload);
    return await handleApiResponse(response, 'UPDATE');
};

export const cancelRental = async (id) => {
    const url = `${api_urls.baseUrl + api_urls.rental.cancel}/${id}`;
    const payload = {}
    const response = await putData(url, payload);
    return await handleApiResponse(response, 'DELETE');
};

export const getRentalsByStatus = async (status) => {
    const url = `${api_urls.baseUrl + api_urls.rental.getByStatus}/${status}`;
    const response = await getData(url);
    return await handleApiResponse(response);
};
