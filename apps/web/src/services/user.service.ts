import axiosClient from '@/lib/axios';
import type { TUser } from '@repo/types';

export const reqGetListUsers = () =>
  axiosClient.get<{ data: TUser[] }>('/users');
