import { api_urls } from "@/utils/apiRoutes";
import { getData, deleteData, postFormData, putFormData, postData, putData } from "@/utils/apiHandler";
import { handleApiResponse } from "@/utils/common";

interface PlanPayload {
    name: string;
    description: string;
    price: number;
    durationInMonths: number;
}

export const addPlan = async (payload: PlanPayload) => {
    const url = api_urls.baseUrl + api_urls.plan.add;
    const response = await postData(url, payload);
    return await handleApiResponse(response);
};

export const getAllPlan = async () => {
    const url = api_urls.baseUrl + api_urls.plan.getAll;
    const response = await getData(url);
    return await handleApiResponse(response);
};

export const updatePlan = async (id: string, payload: PlanPayload) => {
    const url = `${api_urls.baseUrl}${api_urls.plan.update}/${id}`;
    const response = await putData(url, payload);
    return await handleApiResponse(response, 'UPDATE');
};

export const deletePlan = async (id: string) => {
    const url = `${api_urls.baseUrl}${api_urls.plan.delete}/${id}`;
    const response = await deleteData(url);
    return await handleApiResponse(response, 'DELETE');
};






