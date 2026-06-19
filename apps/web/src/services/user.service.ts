import { apiRequest } from '@/lib/axios';
import type { TUser } from '@repo/types';

export const reqGetUser = (signal: AbortSignal) =>
  apiRequest.get<TUser>('/auth/profile', signal);

export const reqGetListUsers = (signal: AbortSignal) =>
  apiRequest.get<TUser[]>('/users', signal);
