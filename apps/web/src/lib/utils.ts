import { ELeadStatus, EPlatform } from '@repo/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { LEAD_STATUS_MAP, PLATFORM_MAP } from './constant';

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

export function displayStatusLead(status: ELeadStatus) {
  return LEAD_STATUS_MAP[status];
}

export function getPlatformBadgeClass(platform: EPlatform | string) {
  return (
    PLATFORM_MAP[platform as keyof typeof PLATFORM_MAP]?.badgeClass ||
    PLATFORM_MAP.OTHER.badgeClass
  );
}

export function displayPlatform(platform: EPlatform | string) {
  return (
    PLATFORM_MAP[platform as keyof typeof PLATFORM_MAP]?.label ||
    PLATFORM_MAP.OTHER.label
  );
}

export const generatePagination = (currentPage: number, totalPages: number) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, '...', totalPages - 1, totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [
      1,
      2,
      '...',
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};
