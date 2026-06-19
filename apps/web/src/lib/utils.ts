import { ELeadStatus } from '@repo/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLeadStatusColor(status: ELeadStatus | string) {
  switch (status) {
    case ELeadStatus.NEW:
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    case ELeadStatus.REPLIED:
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    case ELeadStatus.WAITING:
      return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
    case ELeadStatus.CONVERTED:
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    case ELeadStatus.IGNORED:
      return 'bg-slate-100 text-slate-800 hover:bg-slate-200';
    default:
      return 'bg-slate-100 text-slate-800 hover:bg-slate-200';
  }
}
