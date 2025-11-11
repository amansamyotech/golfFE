import axios, { AxiosRequestConfig } from 'axios';
import { toast } from "react-toastify";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// --- REQUEST INTERCEPTOR ---
api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    // const token = localStorage.getItem("token");
    // if (token) {
    //     config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
});

// --- RESPONSE INTERCEPTOR ---
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;

        if (typeof window !== "undefined") {
            if (status === 401 || status === 403) {
                console.warn("Unauthorized or session expired");

                localStorage.removeItem("token");
                localStorage.removeItem("user");
                toast.error("Session expired or unauthorized. Please log in again.");
                window.location.href = "/signin";
            } else {
                console.error("API Error:", error);
            }

        } else {
            // Log silently during build/SSR
            console.error("API error on server:", error.message);
        }

        // if (status === 401 || status === 403) {
        //     console.warn("Unauthorized or session expired");

        //     localStorage.removeItem("token");
        //     localStorage.removeItem("user");
        //     toast.error("Session expired or unauthorized. Please log in again.");
        //     window.location.href = "/signin";
        // } else {
        //     console.error("API Error:", error);
        // }

        return Promise.reject(error);
    }
);

// --- GET ---
export const getData = async <T = unknown>(url: string, config = {}): Promise<T> => {
    const res = await api.get<T>(url, config);
    return res.data;
};

// --- POST ---
export const postData = async <T = unknown, P = Record<string, unknown>>(url: string, data: P, config = {}): Promise<T> => {
    const res = await api.post<T>(url, data, config);
    return res.data;
};

// --- PUT ---
export const putData = async <T = unknown, P = Record<string, unknown>>(url: string, data: P, config = {}): Promise<T> => {
    const res = await api.put<T>(url, data, config);
    return res.data;
};

// --- DELETE ---
export const deleteData = async <T = unknown>(url: string, config = {}): Promise<T> => {
    const res = await api.delete<T>(url, config);
    return res.data;
};

// --- POST WITH FORM DATA ---
export const postFormData = async <T = unknown>(
    url: string,
    formData: FormData | any,
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
    formData: FormData | any,
    config: AxiosRequestConfig = {}
): Promise<T> => {
    const res = await api.put<T>(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        ...config,
    });

    return res.data;
};
