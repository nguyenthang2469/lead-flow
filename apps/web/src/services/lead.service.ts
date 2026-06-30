import { apiRequest } from '@/lib/axios';
import {
  ELeadStatus,
  EPlatform,
  TLead,
  TPaginationResponse,
  TQueryFilter,
} from '@repo/types';

export type ILeadFilter = TQueryFilter & {
  status?: ELeadStatus;
  platform?: EPlatform;
  assignedTo?: string;
};

export const reqGetLeads = (
  params: ILeadFilter,
  signal: AbortSignal
): Promise<TPaginationResponse<TLead>> =>
  apiRequest.getPagination('/leads', params, signal);

export const reqUpdateLead = (
  id: string,
  data: Partial<TLead>
): Promise<TLead> => apiRequest.patch(`/leads/${id}`, data);

export const reqDeleteLead = (id: string) =>
  apiRequest.delete(`leads/delete/${id}`);
