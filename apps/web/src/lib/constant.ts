import { ELeadStatus } from '@repo/types';

export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
};

export const LEAD_STATUS_LIST = [
  {
    label: 'New',
    value: ELeadStatus.NEW,
  },
  {
    label: 'Replied',
    value: ELeadStatus.REPLIED,
  },
  {
    label: 'Waiting',
    value: ELeadStatus.WAITING,
  },
  {
    label: 'Converted',
    value: ELeadStatus.CONVERTED,
  },
  {
    label: 'Ignored',
    value: ELeadStatus.IGNORED,
  },
];
