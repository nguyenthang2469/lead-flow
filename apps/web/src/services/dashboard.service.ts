import { apiRequest } from '@/lib/axios';
import { TDashboardSummary } from '@repo/types';

export const reqGetSummary = (
  signal: AbortSignal
): Promise<TDashboardSummary> => apiRequest.get('/dashboard/summary', signal);
