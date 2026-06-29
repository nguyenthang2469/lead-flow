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
import { generatePagination } from '@/lib/utils';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { usePathname, useSearchParams } from 'next/navigation';

export default function LeadsPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };
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
            <Pagination className="mt-4 justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href={page > 1 ? createPageURL(page - 1) : '#'}
                    className={
                      page === 1
                        ? 'pointer-events-none opacity-50'
                        : ''
                    }
                  />
                </PaginationItem>
                {generatePagination(page, meta.totalPages).map((p, i) => (
                  <PaginationItem key={i}>
                    {p === '...' ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        href={createPageURL(p)}
                        isActive={page === p}
                      >
                        {p}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href={page < meta.totalPages ? createPageURL(page + 1) : '#'}
                    className={
                      page === meta.totalPages
                        ? 'pointer-events-none opacity-50'
                        : ''
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
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
