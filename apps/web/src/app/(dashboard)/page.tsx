'use client';

import { StatCard } from '@/components/dashboard/StatCard';
import { useDashboard } from '@/hooks/useDashboard';
import { TrendingUp, Clock, Users } from 'lucide-react';
import { CardSkeleton } from '@/components/ui/card-skeleton';

export default function DashboardPage() {
  const { data, isLoading } = useDashboard();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Overview of your lead activity
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              title="Total Leads"
              value={data?.totalLeads ?? 0}
              icon={Users}
              description="All time"
            />
            <StatCard
              title="Pending"
              value={data?.pendingLeads ?? 0}
              icon={Clock}
              description="New + Waiting + Replied"
            />
            <StatCard
              title="Converted"
              value={data?.convertedLeads ?? 0}
              icon={TrendingUp}
              description="Successfully closed"
            />
          </>
        )}
      </div>
    </div>
  );
}
