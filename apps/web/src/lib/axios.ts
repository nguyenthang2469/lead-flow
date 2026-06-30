import { TPaginationResponse } from '@repo/types';
import axios, { HttpStatusCode } from 'axios';

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosClient.interceptors.response.use(
  (response) => {
    if (response.data && response.data.data !== undefined) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    const isAuthRequest = error.config?.url?.startsWith('/auth/');
    if (
      error.response?.status === HttpStatusCode.Unauthorized &&
      typeof window !== 'undefined' &&
      !isAuthRequest
    ) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const apiRequest = {
  get: <T>(url: string, signal: AbortSignal) =>
    axiosClient.get<unknown, T>(url, { signal }),
  getPagination: <TData, TParams extends object>(
    url: string,
    params: TParams,
    signal: AbortSignal
  ) =>
    axiosClient.get<unknown, TPaginationResponse<TData>>(url, {
      params,
      signal,
    }),
  post: <TResponse, TBody = unknown>(url: string, data?: TBody) =>
    axiosClient.post<unknown, TResponse>(url, data),
  patch: <TResponse, TBody = unknown>(url: string, data: TBody) =>
    axiosClient.patch<unknown, TResponse>(url, data),
  delete: <TResponse = void>(url: string) =>
    axiosClient.delete<unknown, TResponse>(url),
};

export default axiosClient;
