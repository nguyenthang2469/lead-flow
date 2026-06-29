'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboard } from '@/hooks/useDashboard';
import {
  Clock,
  TrendingUp,
  UserMinus,
  Users,
  type LucideIcon,
} from 'lucide-react';

interface IStatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  className?: string;
}

export default function CardWrapper() {
  const { data } = useDashboard();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Leads"
        value={data?.cards?.totalLeads ?? 0}
        icon={Users}
        description="All time"
      />
      <StatCard
        title="Pending"
        value={data?.cards?.pendingLeads ?? 0}
        icon={Clock}
        description="New + Waiting + Replied"
      />
      <StatCard
        title="Converted"
        value={data?.cards?.convertedLeads ?? 0}
        icon={TrendingUp}
        description="Successfully closed"
      />
      <StatCard
        title="Unassigned"
        value={data?.cards?.unassignedLeads ?? 0}
        icon={UserMinus}
        description="Leads not assigned to anyone"
      />
    </div>
  );
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  className,
}: IStatCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {description && (
          <p className="text-muted-foreground mt-1 text-xs">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
