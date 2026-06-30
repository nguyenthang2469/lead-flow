import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import type { ELeadStatus, EPlatform, TLead } from '@repo/types';
import { toast } from 'sonner';
import {
  ILeadFilter,
  reqDeleteLead,
  reqGetLeads,
  reqUpdateLead,
} from '@/services/lead.service';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { DEFAULT_PAGINATION } from '@/lib/constant';
import { useCallback, useEffect, useMemo } from 'react';

export function useLeads() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const page = Number(searchParams.get('page')) || DEFAULT_PAGINATION.page;
  const limit = Number(searchParams.get('limit')) || DEFAULT_PAGINATION.limit;
  const search = searchParams.get('search') || undefined;
  const status = (searchParams.get('status') as ELeadStatus) || undefined;
  const platform = (searchParams.get('platform') as EPlatform) || undefined;

  const params = useMemo(
    () => ({ page, limit, search, status, platform }),
    [page, limit, search, status, platform]
  );

  const updateQueryParams = useCallback(
    (newValues: ILeadFilter) => {
      const currentParams = new URLSearchParams(searchParams);
      Object.entries(newValues).forEach(([key, value]) => {
        if (!value) {
          currentParams.delete(key);
        } else currentParams.set(key, String(value));
      });

      // Reset page index when changing search, status or platform
      if (
        ('search' in newValues ||
          'status' in newValues ||
          'platform' in newValues) &&
        !('page' in newValues)
      ) {
        currentParams.set('page', '1');
      }

      replace(`${pathname}?${currentParams.toString()}`, { scroll: false });
    },
    [pathname, replace, searchParams]
  );

  const queryClient = useQueryClient();

  const {
    data: response,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['leads', params],
    queryFn: ({ signal }) => reqGetLeads(params, signal),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    const totalPages = response?.meta?.totalPages || 0;
    if (page < totalPages) {
      const nextParams = { ...params, page: page + 1 };
      queryClient.prefetchQuery({
        queryKey: ['leads', nextParams],
        queryFn: ({ signal }) => reqGetLeads(nextParams, signal),
      });
    }
  }, [page, params, queryClient, response?.meta?.totalPages]);

  useEffect(() => {
    const totalPages = response?.meta?.totalPages;
    if (totalPages !== undefined) {
      if (totalPages === 0 && page > 1) {
        updateQueryParams({ page: 1 });
      } else if (totalPages > 0 && page > totalPages) {
        updateQueryParams({ page: totalPages });
      }
    }
  }, [page, response?.meta?.totalPages, updateQueryParams]);

  return {
    leads: response?.items || [],
    meta: response?.meta,
    isLoading,
    isError,
    isFetching,
    refetch,

    ...params,
    updateQueryParams,
  };
}

export function useUpdateLead() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TLead> }) =>
      reqUpdateLead(id, data),
    onSuccess: () => {
      toast.success('Lead updated successfully');
      void queryClient.invalidateQueries({ queryKey: ['leads'] });
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: () => {
      toast.error('Failed to update lead');
    },
  });

  return {
    updateLead: mutate,
    isUpdating: isPending,
  };
}

export function useDeleteLead() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ id }: { id: string }) => reqDeleteLead(id),
    onSuccess: () => {
      toast.success('Lead deleted successfully');
      void queryClient.invalidateQueries({ queryKey: ['leads'] });
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: () => {
      toast.error('Failed to delete lead');
    },
  });

  return {
    deleteLead: mutate,
    isDeleting: isPending,
  };
}
