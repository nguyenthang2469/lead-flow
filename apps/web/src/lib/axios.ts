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
  getPagination: <P extends object, D = unknown>(
    url: string,
    params: P,
    signal: AbortSignal
  ) =>
    axiosClient.get<unknown, TPaginationResponse<D>>(url, { params, signal }),
  update: <T>(url: string, data: T) => axiosClient.patch<unknown, T>(url, data),
  delete: (url: string) => axiosClient.delete(url),
};

export default axiosClient;
