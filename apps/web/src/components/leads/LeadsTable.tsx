'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { LeadStatusBadge } from './LeadStatusBadge';
import { AssignLeadModal } from './AssignLeadModal';
import { useUpdateLeadStatus } from '@/hooks/useLeads';
import { ELeadStatus, type TLead } from '@repo/types';
import { MoreHorizontal, UserPlus } from 'lucide-react';

const STATUS_ACTIONS: { label: string; value: ELeadStatus }[] = [
  { label: 'New', value: ELeadStatus.NEW },
  { label: 'Replied', value: ELeadStatus.REPLIED },
  { label: 'Waiting', value: ELeadStatus.WAITING },
  { label: 'Converted', value: ELeadStatus.CONVERTED },
  { label: 'Ignored', value: ELeadStatus.IGNORED },
];

interface LeadsTableProps {
  leads: TLead[];
}

export function LeadsTable({ leads }: LeadsTableProps) {
  const updateStatus = useUpdateLeadStatus();
  const [assignModal, setAssignModal] = useState<{
    leadId: string;
    currentAssigneeId: string | null;
  } | null>(null);

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead className="hidden md:table-cell">Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead className="hidden lg:table-cell">Created At</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-muted-foreground h-32 text-center"
                >
                  No leads found
                </TableCell>
              </TableRow>
            ) : (
              leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">
                    {lead.customerName}
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground text-sm">
                      {lead.platform}
                    </span>
                  </TableCell>
                  <TableCell className="hidden max-w-60 md:table-cell">
                    <span className="text-muted-foreground line-clamp-2 text-sm">
                      {lead.message}
                    </span>
                  </TableCell>
                  <TableCell>
                    <LeadStatusBadge status={lead.status} />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-1"
                      onClick={() =>
                        setAssignModal({
                          leadId: lead.id,
                          currentAssigneeId: lead.assignedToId,
                        })
                      }
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      <span className="text-xs">
                        {lead.assignedTo?.name ?? 'Unassigned'}
                      </span>
                    </Button>
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden text-sm lg:table-cell">
                    {new Date(lead.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <div className="text-muted-foreground px-2 py-1 text-xs font-medium">
                          Change status
                        </div>
                        {STATUS_ACTIONS.filter(
                          (a) => a.value !== lead.status
                        ).map((action) => (
                          <DropdownMenuItem
                            key={action.value}
                            onClick={() =>
                              updateStatus.mutate({
                                id: lead.id,
                                status: action.value,
                              })
                            }
                          >
                            → {action.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {assignModal && (
        <AssignLeadModal
          leadId={assignModal.leadId}
          currentAssigneeId={assignModal.currentAssigneeId}
          open={true}
          onClose={() => setAssignModal(null)}
        />
      )}
    </>
  );
}
