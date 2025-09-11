import { api_urls } from "@/utils/apiRoutes";
import { getData, deleteData, postFormData, putFormData } from "@/utils/apiHandler";
import { handleApiResponse } from "@/utils/common";

export const addPlan = async (payload: any) => {
    const url = api_urls.baseUrl + api_urls.plan.add;
    const response = await postFormData(url, payload);
    return await handleApiResponse(response);
};

export const getAllPlan = async () => {
    const url = api_urls.baseUrl + api_urls.plan.getAll;
    const response = await getData(url);
    return await handleApiResponse(response);
};

export const updatePlan = async (id: string, payload: any) => {
    const url = `${api_urls.baseUrl}${api_urls.plan.update}/${id}`;
    const response = await putFormData(url, payload);
    return await handleApiResponse(response, 'UPDATE');
};

export const deletePlan = async (id: string) => {
    const url = `${api_urls.baseUrl}${api_urls.plan.delete}/${id}`;
    const response = await deleteData(url);
    return await handleApiResponse(response, 'DELETE');
};






