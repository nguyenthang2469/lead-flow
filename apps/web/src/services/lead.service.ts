import axiosClient from '@/lib/axios';
import { TLead } from '@repo/types';

export const reqGetListLeads = () =>
  axiosClient.get<{ data: TLead[] }>('/leads');

export const reqUpdateStatusLead = ({
  id,
  status,
}: {
  id: string;
  status: string;
}) => axiosClient.patch(`/leads/${id}/status`, { status });

export const reqAssignLead = ({
  id,
  assignedToId,
}: {
  id: string;
  assignedToId: string | null;
}) => axiosClient.patch(`/leads/${id}/assign`, { assignedToId });
