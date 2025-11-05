import { api_urls } from "@/utils/apiRoutes";
import { getData, postData, putData, deleteData } from "@/utils/apiHandler";
import { handleApiResponse } from "@/utils/common";

export const loginUser = async (payload) => {
    const url = api_urls.baseUrl + api_urls.user.login;
    const response = await postData(url, payload);
    return response;
};