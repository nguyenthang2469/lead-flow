'use client';

import { useDeleteLead, useLeads } from '@/hooks/useLeads';
import { DataTable } from '@/components/ui/data-table';
import { columns } from '@/components/leads/columns';
import { Button } from '@/components/ui/button';
import { RefreshCw, Trash2Icon } from 'lucide-react';
import { LeadsToolbar } from '@/components/leads/leads-toolbar';
import { LeadDetailSheet } from '@/components/leads/lead-detail-sheet';
import { useState } from 'react';
import { TLead } from '@repo/types';
import { ConfirmDialog } from '@/components/ui/confirm-delete';

export default function LeadsPage() {
  const {
    leads,
    meta,
    isLoading,
    isError,
    isFetching,
    refetch,
    page,
    search,
    status,
    platform,
    setPage,
    updateQueryParams,
  } = useLeads();
  const { deleteLead, isDeleting } = useDeleteLead();

  const [selectedLead, setSelectedLead] = useState<TLead | null>(null);
  const [leadToDelete, setLeadToDelete] = useState<TLead | null>(null);

  const handleEdit = (lead: TLead) => {
    setSelectedLead(lead);
  };

  const handleDelete = (lead: TLead) => {
    setLeadToDelete(lead);
  };

  const handleConfirmDelete = () => {
    if (!leadToDelete) return;
    deleteLead({ id: leadToDelete.id });
  };

  const onCloseConfirmDialog = () => {
    setLeadToDelete(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage all incoming leads across channels
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="gap-2"
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`}
          />
          Refresh
        </Button>
      </div>

      <LeadsToolbar
        search={search ?? ''}
        status={status}
        platform={platform}
        updateQueryParams={updateQueryParams}
      />

      {isError ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-center text-red-600">
          Failed to load leads. Please try again.
        </div>
      ) : (
        <div className="space-y-4">
          <DataTable
            columns={columns}
            data={leads}
            isLoading={isLoading}
            onRowClick={handleEdit}
            meta={{
              onEdit: handleEdit,
              onDelete: handleDelete,
            }}
          />

          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1 || isFetching}
              >
                Previous
              </Button>
              <span className="text-muted-foreground px-2 text-sm">
                Page {meta.currentPage} of {meta.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.min(meta.totalPages, page + 1))}
                disabled={page === meta.totalPages || isFetching}
              >
                Next
              </Button>
            </div>
          )}

          <LeadDetailSheet
            lead={selectedLead}
            isOpen={!!selectedLead}
            onClose={() => setSelectedLead(null)}
          />

          <ConfirmDialog
            title="Delete Lead?"
            description={
              <p>
                This will permanently delete the lead{' '}
                <span className="font-semibold text-slate-900">
                  {leadToDelete?.customerName}
                </span>{' '}
                . Are you sure?
              </p>
            }
            primaryButton={isDeleting ? 'Deleting...' : 'Delete'}
            isDisable={isDeleting}
            isOpen={!!leadToDelete}
            sizeModal="sm"
            media={<Trash2Icon />}
            onClose={onCloseConfirmDialog}
            onConfirm={handleConfirmDelete}
          />
        </div>
      )}
    </div>
  );
}
