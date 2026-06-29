import { Suspense } from 'react';
import {
  CardsSkeleton,
  PlatformChartSkeleton,
  RecentLeadsSkeleton,
} from '@/components/ui/skeletons';
import CardWrapper from '@/components/dashboard/stat-card';
import PlatformChart from '@/components/dashboard/platform-chart';
import RecentLeads from '@/components/dashboard/recent-leads';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Overview of your lead activity
        </p>
      </div>

      <Suspense fallback={<CardsSkeleton />}>
        <CardWrapper />
      </Suspense>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Suspense fallback={<PlatformChartSkeleton />}>
          <PlatformChart />
        </Suspense>
        <Suspense fallback={<RecentLeadsSkeleton />}>
          <RecentLeads />
        </Suspense>
      </div>
    </div>
  );
}
