import { apiRequest } from '@/lib/axios';
import { ELeadStatus, EPlatform, TLead, TQueryFilter } from '@repo/types';

export type ILeadFilter = TQueryFilter & {
  status?: ELeadStatus;
  platform?: EPlatform;
  assignedTo?: string;
};

export const reqGetLeads = (params: ILeadFilter, signal: AbortSignal) =>
  apiRequest.getPagination<ILeadFilter, TLead>('/leads', params, signal);

export const reqUpdateLead = (id: string, data: Partial<TLead>) =>
  apiRequest.update(`/leads/${id}`, data);

export const reqDeleteLead = (id: string) =>
  apiRequest.delete(`leads/delete/${id}`);
