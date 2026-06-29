import { Card, CardContent, CardHeader } from './card';
import { Skeleton } from './skeleton';

export function StatSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-5" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-10 w-12" />
        <Skeleton className="h-5 w-44" />
      </CardContent>
    </Card>
  );
}

export function CardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatSkeleton />
      <StatSkeleton />
      <StatSkeleton />
      <StatSkeleton />
    </div>
  );
}

export function PlatformChartSkeleton() {
  return (
    <Card className="md:col-span-2 lg:col-span-3">
      <CardHeader>
        <Skeleton className="h-5 w-40 max-w-2/3" />
      </CardHeader>
      <CardContent className="my-8 space-y-8">
        <div className="relative">
          <Skeleton className="mx-auto size-40 shrink-0 rounded-full sm:size-52" />
          <Skeleton className="bg-background absolute top-1/2 left-1/2 mx-auto size-26 shrink-0 -translate-1/2 rounded-full sm:size-32" />
        </div>
        <div className="flex justify-center gap-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}

export function RecentLeadsSkeleton() {
  return (
    <Card className="md:col-span-2 lg:col-span-4">
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-4">
        <Skeleton className="h-5 w-40 max-w-2/3" />
        <Skeleton className="h-5 w-20 max-w-1/3" />
      </CardHeader>
      <CardContent className="space-y-2">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="flex items-center justify-between py-2">
            <div className="flex w-fit items-center gap-4">
              <Skeleton className="size-9 shrink-0 rounded-full" />
              <div className="grid gap-2">
                <Skeleton className="h-3.5 w-30" />
                <Skeleton className="h-3.5 w-50" />
              </div>
            </div>
            <Skeleton className="h-3.5 w-25" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
