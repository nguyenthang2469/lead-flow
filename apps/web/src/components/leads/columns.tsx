'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TLead } from '@repo/types';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import {
  displayStatusLead,
  getLeadStatusColor,
  displayPlatform,
  getPlatformBadgeClass,
  cn,
} from '@/lib/utils';
import { AssigneeCell } from './assignee-cell';

export const columns: ColumnDef<TLead>[] = [
  {
    accessorKey: 'customerName',
    header: 'Customer',
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('customerName')}</div>
    ),
  },
  {
    accessorKey: 'platform',
    header: 'Source',
    cell: ({ row }) => {
      const platform = row.getValue('platform') as string;
      return (
        <Badge
          className={cn(
            getPlatformBadgeClass(platform),
            'text-xs uppercase font-medium border-transparent'
          )}
        >
          {displayPlatform(platform)}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'message',
    header: 'Latest Message',
    cell: ({ row }) => {
      const message = row.getValue('message') as string;
      return (
        <div className="max-w-75 truncate" title={message}>
          {message}
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge
        className={`${getLeadStatusColor(row.original.status)} border-transparent font-medium`}
      >
        {displayStatusLead(row.original.status)}
      </Badge>
    ),
  },
  {
    accessorKey: 'assignedTo',
    header: 'Assigned To',
    cell: ({ row }) => <AssigneeCell assignedTo={row.original.assignedTo} />,
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as Date;
      return (
        <div className="text-sm text-slate-500">
          {format(new Date(date), 'MMM dd, yyyy HH:mm')}
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row, table }) => {
      const lead = row.original;

      const meta = table.options.meta as {
        onEdit?: (lead: TLead) => void;
        onDelete?: (lead: TLead) => void;
      };

      const handleCopyId = () => {
        navigator.clipboard.writeText(lead.id);
        toast.success('Lead ID copied to clipboard');
      };

      return (
        <div onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={handleCopyId}
                className="cursor-pointer"
              >
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => meta.onEdit?.(lead)}
                className="cursor-pointer"
              >
                View / Edit Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => meta.onDelete?.(lead)}
                className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
