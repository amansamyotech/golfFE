import { api_urls } from "@/utils/apiRoutes";
import { getData, postFormData, putFormData, deleteData } from "@/utils/apiHandler";
import { handleApiResponse } from "@/utils/common";

export interface StaffPayload {
    name: string;
    email: string;
    phone: string;
    gender: string;
    address: string;
    jobTitle: string;
    department: string;
    employmentType: string;
    dateOfJoining: string; // ISO date string
    workShift: string;
    salary: number;
    staffProfileImg?: File | string; // can be File for upload or URL string
}


export const addStaff = async (payload: StaffPayload) => {
    const url = api_urls.baseUrl + api_urls.staff.add;
    const response = await postFormData(url, payload);
    return await handleApiResponse(response);
};

export const getAllStaff = async () => {
    const url = api_urls.baseUrl + api_urls.staff.getAll;
    const response = await getData(url);
    return await handleApiResponse(response);
};

export const updateStaff = async (id: string, payload: StaffPayload) => {
    const url = `${api_urls.baseUrl}${api_urls.staff.update}/${id}`;
    const response = await putFormData(url, payload);
    return handleApiResponse(response, 'UPDATE');
};

export const deleteStaff = async (id: string) => {
    const url = `${api_urls.baseUrl}${api_urls.staff.delete}/${id}`;
    const response = await deleteData(url);
    return handleApiResponse(response, 'DELETE');
};






