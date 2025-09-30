import { api_urls } from "@/utils/apiRoutes";
import { getData, postData, putData, deleteData } from "@/utils/apiHandler";
import { handleApiResponse } from "@/utils/common";

interface CoursePayload {
    _id: string;
    name?: string;
    courseNumber?: string;
    holes?: number;
    location?: string;
}

export const addCourse = async (payload: CoursePayload) => {
    const url = api_urls.baseUrl + api_urls.course.add;
    const response = await postData(url, payload);
    return await handleApiResponse(response);
};

export const getAllCourses = async () => {
    const url = api_urls.baseUrl + api_urls.course.getAll;
    const response = await getData(url);
    return await handleApiResponse(response);
};

export const updateCourse = async (id: string, payload: CoursePayload) => {
    const url = `${api_urls.baseUrl}${api_urls.course.update}/${id}`;
    const response = await putData(url, payload);
    return handleApiResponse(response, 'UPDATE');
};

export const deleteCourse = async (id: string) => {
    const url = `${api_urls.baseUrl}${api_urls.course.delete}/${id}`;
    const response = await deleteData(url);
    return handleApiResponse(response, 'DELETE');
};






