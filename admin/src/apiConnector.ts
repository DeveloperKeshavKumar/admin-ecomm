import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export const LOCAL_URL = "http://localhost:5000";
export const PRODUCTION_URL = "https://api.yourdomain.com";

export const axiosInstance: AxiosInstance = axios.create({});

export const apiConnector = async <T>(
    method: "get" | "post" | "put" | "delete",
    url: string,
    bodyData?: any,
    headers?: Record<string, string>,
    params?: Record<string, any>
): Promise<AxiosResponse<T>> => {
    const config: AxiosRequestConfig = {
        method,
        url,
        data: bodyData,
        headers,
        params,
    };

    return axiosInstance.request<T>(config);
};