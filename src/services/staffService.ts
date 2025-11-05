import { api_urls } from "@/utils/apiRoutes";
import { getData, postFormData, putFormData, deleteData, putData } from "@/utils/apiHandler";
import { handleApiResponse } from "@/utils/common";

export interface StaffPayload {
    _id?: string;
    name?: string;
    email?: string;
    phone?: string;
    gender?: string;
    staffProfileImg?: string;
    address?: string;
    jobTitle?: string;
    department?: string;
    employmentType?: string;
    dateOfJoining?: string;
    workShift?: string;
    salary?: number | string;
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

export const getStaffById = async (id) => {
    const url = `${api_urls.baseUrl}${api_urls.staff.getById}/${id}`;
    const response = await getData(url);
    return await handleApiResponse(response);
};

export const deleteStaff = async (id: string) => {
    const url = `${api_urls.baseUrl}${api_urls.staff.delete}/${id}`;
    const response = await deleteData(url);
    return handleApiResponse(response, 'DELETE');
};

export const updateWorkingShift = async (id: string, workShift: StaffPayload) => {
    const url = `${api_urls.baseUrl}${api_urls.staff.updateShift}/${id}`;
    const payload = { workShift: workShift };
    const response = await putData(url, payload);
    return handleApiResponse(response, 'UPDATE');
};

export const changeAvailabilityStatus = async (id: string, availabilityStatus: StaffPayload) => {
    const url = `${api_urls.baseUrl}${api_urls.staff.usedateStatus}/${id}`;
    const payload = { availabilityStatus: availabilityStatus };
    const response = await putData(url, payload);
    return handleApiResponse(response, 'UPDATE');
};












