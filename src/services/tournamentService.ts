import { api_urls } from "@/utils/apiRoutes";
import { getData, postData, putData, deleteData, putFormData } from "@/utils/apiHandler";
import { handleApiResponse } from "@/utils/common";

export const addTournament = async (payload: any) => {
    const url = api_urls.baseUrl + api_urls.tournament.add;
    const response = await postData(url, payload);
    return await handleApiResponse(response);
};

export const getTournament = async () => {
    const url = api_urls.baseUrl + api_urls.tournament.getAll;
    const response = await getData(url);
    return await handleApiResponse(response);
};

export const updateTournament = async (id: any, payload: any) => {
    const url = `${api_urls.baseUrl}${api_urls.tournament.update}/${id}`;
    const response = await putData(url, payload);
    return await handleApiResponse(response, 'UPDATE');
};

export const deleteTournament = async (id: string) => {
    const url = `${api_urls.baseUrl}${api_urls.tournament.delete}/${id}`;
    const response = await deleteData(url);
    return await handleApiResponse(response, 'DELETE');
};

export const assignPlayerToTheTournament = async (id: any, payload: any) => {
    const url = `${api_urls.baseUrl}${api_urls.tournament.assignPlayer}/${id}`;
    const response = await postData(url, payload);
    return await handleApiResponse(response);
}

export const getTournamentById = async (id) => {
    const url = `${api_urls.baseUrl}${api_urls.tournament.getById}/${id}`;
    const response = await getData(url);
    return await handleApiResponse(response);
};

export const changeTournamentStatus = async (id, newStatus) => {
    const url = `${api_urls.baseUrl}${api_urls.tournament.changeStatus}/${id}`;
    const body = { status: newStatus };
    const response = await putData(url, body);
    return await handleApiResponse(response, 'UPDATE');
};


