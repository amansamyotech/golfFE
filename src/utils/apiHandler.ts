import axios, { AxiosRequestConfig } from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// --- GET ---
export const getData = async <T = unknown>(url: string, config: AxiosRequestConfig = {}): Promise<T> => {
    const res = await api.get<T>(url, config);
    return res.data;
};

// --- POST ---
export const postData = async <T = unknown, P = Record<string, unknown>>(
    url: string,
    data: P,
    config: AxiosRequestConfig = {}
): Promise<T> => {
    const res = await api.post<T>(url, data, config);
    return res.data;
};

// --- PUT ---
export const putData = async <T = unknown, P = Record<string, unknown>>(
    url: string,
    data: P,
    config: AxiosRequestConfig = {}
): Promise<T> => {
    const res = await api.put<T>(url, data, config);
    return res.data;
};

// --- DELETE ---
export const deleteData = async <T = unknown>(url: string, config: AxiosRequestConfig = {}): Promise<T> => {
    const res = await api.delete<T>(url, config);
    return res.data;
};

// --- POST WITH FORM DATA ---
// export const postFormData = async <T = unknown, P extends Record<string, unknown>>(
//     url: string,
//     data: P,
//     config: AxiosRequestConfig = {}
// ): Promise<T> => {
//     const formData = new FormData();
//     for (const key in data) {
//         formData.append(key, String(data[key]));
//     }

//     const res = await api.post<T>(url, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//         ...config,
//     });

//     return res.data;
// };

export const postFormData = async <T = unknown>(
    url: string,
    formData: FormData,
    config: AxiosRequestConfig = {}
): Promise<T> => {
    const res = await api.post<T>(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        ...config,
    });

    return res.data;
};


// --- PUT WITH FORM DATA ---
export const putFormData = async <T = unknown>(
    url: string,
    formData: FormData,
    config: AxiosRequestConfig = {}
): Promise<T> => {
    const res = await api.put<T>(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        ...config,
    });

    return res.data;
};
