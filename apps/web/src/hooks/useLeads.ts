import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { TLead } from '@repo/types';
import { toast } from 'sonner';
import {
  reqAssignLead,
  reqGetListLeads,
  reqUpdateStatusLead,
} from '@/services/lead.service';

export function useLeads() {
  return useQuery<TLead[]>({
    queryKey: ['leads'],
    queryFn: async () => {
      const res = await reqGetListLeads();
      return res.data.data;
    },
  });
}

export function useUpdateLeadStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: reqUpdateStatusLead,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['leads'] });
      void qc.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Status updated');
    },
    onError: () => toast.error('Failed to update status'),
  });
}

export function useAssignLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: reqAssignLead,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead assigned successfully');
    },
    onError: () => toast.error('Failed to assign lead'),
  });
}
