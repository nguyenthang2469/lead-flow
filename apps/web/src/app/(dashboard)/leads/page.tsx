'use client';

import { useState, useMemo } from 'react';
import { LeadsTable } from '@/components/leads/LeadsTable';
import { LeadFilters } from '@/components/leads/LeadFilters';
import { useLeads } from '@/hooks/useLeads';
import { ELeadStatus } from '@repo/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function LeadsPage() {
  const { data: leads = [], isLoading } = useLeads();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ELeadStatus | 'all'>('all');

  const filtered = useMemo(() => {
    return leads.filter((lead) => {
      const matchSearch = lead.customerName
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchStatus =
        statusFilter === 'all' || lead.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [leads, search, statusFilter]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage all incoming leads across channels
        </p>
      </div>

      <LeadFilters
        search={search}
        status={statusFilter}
        onSearchChange={setSearch}
        onStatusChange={setStatusFilter}
      />

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-md" />
          ))}
        </div>
      ) : (
        <LeadsTable leads={filtered} />
      )}

      <p className="text-muted-foreground text-xs">
        Showing {filtered.length} of {leads.length} leads
      </p>
    </div>
  );
}
