import axiosClient from '@/lib/axios';
import { TLoginPayload } from '@/types/auth.type';
import { TUser } from '@repo/types';

export const reqLogin = (data: TLoginPayload) =>
  axiosClient.post<unknown, TUser>('/auth/login', data);

export const reqLogout = () => axiosClient.post('/auth/logout');
