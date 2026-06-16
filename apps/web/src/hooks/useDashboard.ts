import { useQuery } from '@tanstack/react-query';
import type { TDashboardSummary } from '@repo/types';
import { reqGetSummary } from '@/services/dashboard.service';

export function useDashboard() {
  return useQuery<TDashboardSummary>({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await reqGetSummary();
      return res.data.data;
    },
    refetchInterval: 60_000,
  });
}
