import axiosClient from '@/lib/axios';
import { TLoginPayload } from '@/types/auth.type';
import { TUser } from '@repo/types';

export const reqGetUser = () =>
  axiosClient.get<{ data: TUser }>('/auth/profile');

export const reqLogin = (data: TLoginPayload) =>
  axiosClient.post('/auth/login', data);

export const reqLogout = () => axiosClient.post('/auth/logout');
