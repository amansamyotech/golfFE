import { api_urls } from "@/utils/apiRoutes";
import {
    getData,
    postData,
    putData,
    deleteData
} from "@/utils/apiHandler";
import { handleApiResponse } from "@/utils/common";

export const monthlySalesReport = async () => {
    const url = api_urls.baseUrl + api_urls.report.monthlySales
    const response = await getData(url);
    return await handleApiResponse(response);
};

export const dailySalesReport = async () => {
    // const url = `${api_urls.baseUrl + api_urls.report.dailySales}?startDate=${startDate}&endDate=${endDate}`;
    const url = `${api_urls.baseUrl + api_urls.report.dailySales}`;
    const response = await getData(url);
    return await handleApiResponse(response);
}

export const dailySalesRentalReport = async () => {
    const url = `${api_urls.baseUrl + api_urls.report.dailySalesRental}`;
    const response = await getData(url);
    return await handleApiResponse(response);
}

export const monthlySalesRentalReport = async () => {
    const url = `${api_urls.baseUrl + api_urls.report.monthlySalesRental}`;
    const response = await getData(url);
    return await handleApiResponse(response);
}