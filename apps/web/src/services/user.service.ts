import { apiRequest } from '@/lib/axios';
import type { TUser } from '@repo/types';

export const reqGetUser = (signal: AbortSignal): Promise<TUser> =>
  apiRequest.get('/auth/profile', signal);

export const reqGetListUsers = (signal: AbortSignal): Promise<TUser[]> =>
  apiRequest.get('/users', signal);
