import { api_urls } from "@/utils/apiRoutes";
import { getData, deleteData, postFormData, putFormData, postData } from "@/utils/apiHandler";
import { handleApiResponse } from "@/utils/common";

export const addBooking = async (payload: any) => {
    const url = api_urls.baseUrl + api_urls.booking.add;
    const response = await postData(url, payload);
    return await handleApiResponse(response);
};









