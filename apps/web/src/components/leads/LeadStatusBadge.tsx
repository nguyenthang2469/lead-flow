import { ELeadStatus } from '@repo/types';
import { Badge } from '../ui/badge';

const STATUS_CONFIG: Record<ELeadStatus, { label: string; className: string }> =
  {
    [ELeadStatus.NEW]: {
      label: 'New',
      className: 'bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200',
    },
    [ELeadStatus.REPLIED]: {
      label: 'Replied',
      className:
        'bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200',
    },
    [ELeadStatus.WAITING]: {
      label: 'Waiting',
      className:
        'bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200',
    },
    [ELeadStatus.CONVERTED]: {
      label: 'Converted',
      className:
        'bg-green-100 text-green-700 hover:bg-green-100 border-green-200',
    },
    [ELeadStatus.IGNORED]: {
      label: 'Ignored',
      className: 'bg-gray-100 text-gray-500 hover:bg-gray-100 border-gray-200',
    },
  };

export const LeadStatusBadge = ({ status }: { status: ELeadStatus }) => {
  const config = STATUS_CONFIG[status];

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
};
