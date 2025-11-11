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
    // return response;
    return handleApiResponse(response);
};