'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ELeadStatus } from '@repo/types';
import { Search } from 'lucide-react';

interface LeadFiltersProps {
  search: string;
  status: ELeadStatus | 'all';
  onSearchChange: (v: string) => void;
  onStatusChange: (v: ELeadStatus | 'all') => void;
}

export function LeadFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: LeadFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative min-w-50 flex-1">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Search by customer name..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select
        value={status}
        onValueChange={(v) => onStatusChange(v as ELeadStatus | 'all')}
      >
        <SelectTrigger className="w-45">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value={ELeadStatus.NEW}>New</SelectItem>
          <SelectItem value={ELeadStatus.REPLIED}>Replied</SelectItem>
          <SelectItem value={ELeadStatus.WAITING}>Waiting</SelectItem>
          <SelectItem value={ELeadStatus.CONVERTED}>Converted</SelectItem>
          <SelectItem value={ELeadStatus.IGNORED}>Ignored</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
