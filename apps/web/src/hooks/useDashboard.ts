import { useQuery } from '@tanstack/react-query';
import type { TDashboardSummary } from '@repo/types';
import { reqGetSummary } from '@/services/dashboard.service';

export function useDashboard() {
  return useQuery<TDashboardSummary>({
    queryKey: ['dashboard'],
    queryFn: ({ signal }) => reqGetSummary(signal),
    refetchInterval: 60_000,
  });
}
