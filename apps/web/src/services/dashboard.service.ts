import { apiRequest } from '@/lib/axios';
import { TDashboardSummary } from '@repo/types';

export const reqGetSummary = (signal: AbortSignal) =>
  apiRequest.get<TDashboardSummary>('/dashboard/summary', signal);
