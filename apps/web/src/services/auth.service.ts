import { apiRequest } from '@/lib/axios';
import { TLoginPayload } from '@/types/auth.type';
import { TUser } from '@repo/types';

export const reqLogin = (data: TLoginPayload): Promise<TUser> =>
  apiRequest.post('/auth/login', data);

export const reqLogout = () => apiRequest.post('/auth/logout');
