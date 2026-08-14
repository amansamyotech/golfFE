import { api_urls } from "@/utils/apiRoutes";
import { getData, postData, putData, deleteData } from "@/utils/apiHandler";
import { handleApiResponse } from "@/utils/common";
import axios from "axios";

export const loginUser = async (payload) => {
    const url = api_urls.baseUrl + api_urls.user.login;
    const response = await axios.post(url, payload);
    return response;
};

export const getUserProfile = async (id) => {
    const url = `${api_urls.baseUrl}${api_urls.user.getProfile}/${id}`;
    const response = await getData(url);
    return handleApiResponse(response);
};

export const editUserProfileData = async (id, data) => {
    const url = `${api_urls.baseUrl}${api_urls.user.update}/${id}`;
    const response = await putData(url, data);
    return handleApiResponse(response, 'UPDATE');
};

export const changePassword = async (id: string, data: { currentPassword: string; newPassword: string }) => {
    const url = `${api_urls.baseUrl}${api_urls.user.changePassword}/${id}`;
    const response = await putData(url, data);
    return handleApiResponse(response, 'UPDATE');
};




