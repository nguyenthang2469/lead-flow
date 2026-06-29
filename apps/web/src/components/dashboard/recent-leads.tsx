'use client';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useMemo } from 'react';
import { useDashboard } from '@/hooks/useDashboard';
import { Badge } from '../ui/badge';
import { format } from 'date-fns';
import {
  displayStatusLead,
  getLeadStatusColor,
  displayPlatform,
  getPlatformBadgeClass,
  cn,
} from '@/lib/utils';
import Link from 'next/link';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Inbox } from 'lucide-react';

export default function RecentLeads() {
  const { data } = useDashboard();
  const recentLeads = useMemo(
    () => data?.recentLeads ?? [],
    [data?.recentLeads]
  );

  return (
    <Card className="flex flex-col md:col-span-2 lg:col-span-4">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle>Recent Leads</CardTitle>
        <Link
          href="/leads"
          className="text-muted-foreground hover:text-primary text-xs transition-colors"
        >
          View all
        </Link>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-2">
          {' '}
          {recentLeads.length > 0 ? (
            recentLeads.map((lead) => {
              const initials = lead.customerName.substring(0, 2).toUpperCase();

              return (
                <div
                  key={lead.id}
                  className="hover:bg-muted/50 -mx-2 flex items-center justify-between rounded-lg p-2 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-1">
                      <p className="text-sm leading-none font-medium">
                        {lead.customerName}
                      </p>
                      <div className="text-muted-foreground flex items-center gap-2 pt-1 text-xs">
                        <Badge
                          className={cn(
                            getPlatformBadgeClass(lead.platform),
                            'h-4 px-1 text-[10px] font-normal uppercase'
                          )}
                        >
                          {displayPlatform(lead.platform)}
                        </Badge>
                        <span>
                          {format(
                            new Date(lead.createdAt),
                            'MMM dd, yyyy HH:mm'
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Badge
                    className={`${getLeadStatusColor(lead.status)} border-transparent text-xs font-medium`}
                  >
                    {displayStatusLead(lead.status)}
                  </Badge>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <Inbox className="h-6 w-6 text-slate-400" />
              </div>
              <p className="text-sm font-medium">No recent leads</p>
              <p className="mt-1 text-xs text-slate-500">
                Your newest customers will appear here.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
