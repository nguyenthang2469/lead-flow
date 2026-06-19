import { apiRequest } from '@/lib/axios';
import { ELeadStatus, EPlatform, TLead, TQueryFilter } from '@repo/types';

export interface ILeadFilter {
  status?: ELeadStatus;
  platform?: EPlatform;
  assignedTo?: string;
}

export const reqGetLeads = (
  params: TQueryFilter<ILeadFilter>,
  signal: AbortSignal
) =>
  apiRequest.getPagination<TQueryFilter<ILeadFilter>, TLead>(
    '/leads',
    params,
    signal
  );

export const reqUpdateLead = (id: string, data: Partial<TLead>) =>
  apiRequest.update(`/leads/${id}`, data);

export const reqDeleteLead = (id: string) =>
  apiRequest.delete(`leads/delete/${id}`);
