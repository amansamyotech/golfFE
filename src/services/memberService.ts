import { api_urls } from "@/utils/apiRoutes";
import { getData, deleteData, postFormData, putFormData } from "@/utils/apiHandler";
import { handleApiResponse } from "@/utils/common";

interface MemberPayload {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    membershipType: string;
}

export const addMember = async (payload: MemberPayload) => {
    const url = api_urls.baseUrl + api_urls.member.add;
    const response = await postFormData(url, payload);
    return await handleApiResponse(response);
};

export const getAllMember = async () => {
    const url = api_urls.baseUrl + api_urls.member.getAll;
    const response = await getData(url);
    return await handleApiResponse(response);
};

export const updateMember = async (id: string, payload: MemberPayload) => {
    const url = `${api_urls.baseUrl}${api_urls.member.update}/${id}`;
    const response = await putFormData(url, payload);
    return await handleApiResponse(response, 'UPDATE');
};

export const deleteMember = async (id: string) => {
    const url = `${api_urls.baseUrl}${api_urls.member.delete}/${id}`;
    const response = await deleteData(url);
    return await handleApiResponse(response, 'DELETE');
};

export const getById = async (id: string) => {
    const url = `${api_urls.baseUrl}${api_urls.member.getById}/${id}`;
    const response = await getData(url);
    return await handleApiResponse(response);
};






