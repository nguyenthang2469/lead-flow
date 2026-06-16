import axios, { HttpStatusCode } from 'axios';

const apiRequest = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === HttpStatusCode.Unauthorized &&
      typeof window !== 'undefined'
    ) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiRequest;
