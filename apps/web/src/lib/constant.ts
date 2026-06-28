import { ELeadStatus, EPlatform } from '@repo/types';

export const PLATFORM_MAP = {
  [EPlatform.MESSENGER]: {
    label: 'Messenger',
    color: '#2563eb', // text-blue-600
    badgeClass: 'bg-blue-600 text-white hover:bg-blue-700 border-transparent',
  },
  [EPlatform.ZALO]: {
    label: 'Zalo',
    color: '#0891b2', // text-cyan-600
    badgeClass: 'bg-cyan-600 text-white hover:bg-cyan-700 border-transparent',
  },
  [EPlatform.TIKTOK]: {
    label: 'TikTok',
    color: '#171717', // text-neutral-900
    badgeClass: 'bg-neutral-900 text-white hover:bg-neutral-950 border-transparent',
  },
  OTHER: {
    label: 'Other',
    color: '#64748b', // text-slate-500
    badgeClass: 'bg-slate-500 text-white hover:bg-slate-600 border-transparent',
  },
};

export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
};

export const LEAD_STATUS_MAP = {
  [ELeadStatus.NEW]: 'New',
  [ELeadStatus.REPLIED]: 'Replied',
  [ELeadStatus.WAITING]: 'Waiting',
  [ELeadStatus.CONVERTED]: 'Converted',
  [ELeadStatus.IGNORED]: 'Ignored',
};

export const LEAD_STATUS_LIST = [
  {
    label: LEAD_STATUS_MAP[ELeadStatus.NEW],
    value: ELeadStatus.NEW,
  },
  {
    label: LEAD_STATUS_MAP[ELeadStatus.REPLIED],
    value: ELeadStatus.REPLIED,
  },
  {
    label: LEAD_STATUS_MAP[ELeadStatus.WAITING],
    value: ELeadStatus.WAITING,
  },
  {
    label: LEAD_STATUS_MAP[ELeadStatus.CONVERTED],
    value: ELeadStatus.CONVERTED,
  },
  {
    label: LEAD_STATUS_MAP[ELeadStatus.IGNORED],
    value: ELeadStatus.IGNORED,
  },
];
