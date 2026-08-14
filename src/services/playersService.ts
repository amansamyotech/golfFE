import { api_urls } from "@/utils/apiRoutes";
import { getData, deleteData, putFormData, postFormData } from "@/utils/apiHandler";
import { handleApiResponse } from "@/utils/common";

export const addPlayer = async (payload: any) => {
    const url = api_urls.baseUrl + api_urls.player.add;
    const response = await postFormData(url, payload);
    return await handleApiResponse(response);
};

export const getPlayer = async () => {
    const url = api_urls.baseUrl + api_urls.player.getAll;
    const response = await getData(url);
    return await handleApiResponse(response);
};

export const updatePlayer = async (id: any, payload: any) => {
    const url = `${api_urls.baseUrl}${api_urls.player.update}/${id}`;
    const response = await putFormData(url, payload);
    return await handleApiResponse(response, 'UPDATE');
};

export const deletePlayer = async (id: string) => {
    const url = `${api_urls.baseUrl}${api_urls.player.delete}/${id}`;
    const response = await deleteData(url);
    return await handleApiResponse(response, 'DELETE');
};

// export const getPlayerByNumber = async () => {
//     const url = api_urls.baseUrl + api_urls.player.getByNumber;
//     const response = await getData(url);
//     return await handleApiResponse(response);
// };

export const getPlayerByNumber = async (phone : any) => {
    const url = `${api_urls.baseUrl + api_urls.player.getByNumber}?phone=${encodeURIComponent(phone)}`;
    const response = await getData(url);
    return await handleApiResponse(response);
}