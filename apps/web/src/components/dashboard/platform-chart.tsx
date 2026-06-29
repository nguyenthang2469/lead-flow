'use client';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { PieChart, Pie, Label } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '../ui/chart';
import { useMemo } from 'react';
import { useDashboard } from '@/hooks/useDashboard';
import { PLATFORM_MAP } from '@/lib/constant';

export const chartConfig = {
  platform: { label: 'Platform' },
  MESSENGER: {
    label: PLATFORM_MAP.MESSENGER.label,
    color: PLATFORM_MAP.MESSENGER.color,
  },
  ZALO: {
    label: PLATFORM_MAP.ZALO.label,
    color: PLATFORM_MAP.ZALO.color,
  },
  TIKTOK: {
    label: PLATFORM_MAP.TIKTOK.label,
    color: PLATFORM_MAP.TIKTOK.color,
  },
  OTHER: {
    label: PLATFORM_MAP.OTHER.label,
    color: PLATFORM_MAP.OTHER.color,
  },
} satisfies ChartConfig;

export default function PlatformChart() {
  const { data } = useDashboard();
  const chartData = useMemo(() => data?.chartData ?? [], [data?.chartData]);
  const totalLeads = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0);
  }, [chartData]);

  const formattedChartData =
    chartData.map((item) => ({
      name: item.name,
      value: item.value,
      fill:
        PLATFORM_MAP[item.name as keyof typeof PLATFORM_MAP]?.color ||
        PLATFORM_MAP.OTHER.color,
    })) || [];

  return (
    <Card className="flex flex-col md:col-span-2 lg:col-span-3">
      <CardHeader className="items-center pb-0">
        <CardTitle>Leads by Platform</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-75"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={formattedChartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5} // Tạo đường viền trắng giữa các lát cắt cho đẹp
              stroke="var(--background)"
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 4}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalLeads.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 20}
                          className="fill-muted-foreground"
                        >
                          Leads
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent />}
              className="-translate-y-2 flex-wrap gap-2"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
