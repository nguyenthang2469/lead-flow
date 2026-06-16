import axiosClient from '@/lib/axios';
import { TDashboardSummary } from '@repo/types';

export const reqGetSummary = () =>
  axiosClient.get<{ data: TDashboardSummary }>('/dashboard/summary');
