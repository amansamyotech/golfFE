import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// --- GET ---
export const getData = async (url: string, config = {}) => {
    const res = await api.get(url, config);
    return res.data;
};

// --- POST ---
export const postData = async (url: string, data: any, config = {}) => {
    const res = await api.post(url, data, config);
    return res.data;
};

// --- PUT ---
export const putData = async (url: string, data: any, config = {}) => {
    const res = await api.put(url, data, config);
    return res.data;
};

// --- DELETE ---
export const deleteData = async (url: string, config = {}) => {
    const res = await api.delete(url, config);
    return res.data;
};

// --- POST WITH IMAGE ---
export const postFormData = async (url: string, data: any, config = {}) => {
    const formData = new FormData();
    for (const key in data) {
        formData.append(key, data[key]);
    }

    // Log actual FormData content
    console.log("FormData content:");
    for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
    }

    const res = await api.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        ...config,
    });

    return res.data;
};

// --- PUT WITH IMAGE ---
export const putFormData = async (url: string, data: any, config = {}) => {
    const formData = new FormData();

    for (const key in data) {
        formData.append(key, data[key]);
    }

    const res = await api.put(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        ...config,
    });

    return res.data;
};

