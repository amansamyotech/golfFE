import { api_urls } from "@/utils/apiRoutes";
import { getData, deleteData, putFormData, postFormData, putData } from "@/utils/apiHandler";
import { handleApiResponse } from "@/utils/common";

export const addProduct = async (payload) => {
    const url = api_urls.baseUrl + api_urls.proshop.add;
    const response = await postFormData(url, payload);
    return await handleApiResponse(response);
};

export const getAllProducts = async () => {
    const url = api_urls.baseUrl + api_urls.proshop.getAll;
    const response = await getData(url);
    return await handleApiResponse(response);
};


export const getProductById = async (id) => {
    const url = `${api_urls.baseUrl}${api_urls.proshop.getById}/${id}`;
    const response = await getData(url);
    return await handleApiResponse(response);
};


export const updateProduct = async (id, payload) => {
    const url = `${api_urls.baseUrl}${api_urls.proshop.update}/${id}`;
    const response = await putFormData(url, payload);
    return await handleApiResponse(response, 'UPDATE');
};


export const updateStock = async (id, payload) => {
    const url = `${api_urls.baseUrl}${api_urls.proshop.updateStock}/${id}`;
    const response = await putData(url, payload);
    return await handleApiResponse(response);
};


export const deleteProduct = async (id) => {
    const url = `${api_urls.baseUrl}${api_urls.proshop.delete}/${id}`;
    const response = await deleteData(url);
    return await handleApiResponse(response, 'DELETE');
};






