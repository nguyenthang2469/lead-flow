'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ELeadStatus, EPlatform } from '@repo/types';
import { SearchIcon, X, XIcon } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';
import { Button } from '../ui/button';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '../ui/input-group';
import { useRef } from 'react';
import { ISearchParamsLead } from '@/services/lead.service';

interface ILeadsToolbarProps {
  search: string;
  status: string | undefined;
  platform: string | undefined;
  updateQueryParams: (params: ISearchParamsLead) => void;
}

export function LeadsToolbar({
  search,
  status,
  platform,
  updateQueryParams,
}: ILeadsToolbarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useDebouncedCallback(
    (term: string) => updateQueryParams({ search: term }),
    500
  );

  const handleClearInputSearch = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleReset = () => {
    handleClearInputSearch();
    updateQueryParams({ search: '', status: undefined, platform: undefined });
  };

  const onClearInput = () => {
    handleClearInputSearch();
    updateQueryParams({ search: '' });
  };

  const isFiltered = search.length > 0 || !!status || !!platform;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-4">
      <div className="flex flex-1 items-center gap-2">
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <SearchIcon className="text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput
            ref={inputRef}
            id="search"
            placeholder="Search by name or message..."
            defaultValue={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pr-8 pl-9"
          />
          {search && (
            <InputGroupAddon align="inline-end">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={onClearInput}
              >
                <XIcon className="text-muted-foreground" />
              </Button>
            </InputGroupAddon>
          )}
        </InputGroup>

        <Select
          value={status || 'all'}
          onValueChange={(val) =>
            updateQueryParams({
              status: val === 'all' ? undefined : (val as ELeadStatus),
            })
          }
        >
          <SelectTrigger className="w-37.5">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="NEW">New</SelectItem>
            <SelectItem value="REPLIED">Replied</SelectItem>
            <SelectItem value="WAITING">Waiting</SelectItem>
            <SelectItem value="CONVERTED">Converted</SelectItem>
            <SelectItem value="IGNORED">Ignored</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={platform || 'all'}
          onValueChange={(val) =>
            updateQueryParams({
              platform: val === 'all' ? undefined : (val as EPlatform),
            })
          }
        >
          <SelectTrigger className="w-37.5">
            <SelectValue placeholder="All Platforms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="MESSENGER">Messenger</SelectItem>
            <SelectItem value="ZALO">Zalo</SelectItem>
            <SelectItem value="TIKTOK">TikTok</SelectItem>
          </SelectContent>
        </Select>

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={handleReset}
            className="h-8 px-2 text-slate-500 hover:text-slate-900 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
