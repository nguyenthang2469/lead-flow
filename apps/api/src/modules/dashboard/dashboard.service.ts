import { LeadStatus } from '@/generated/prisma/enums';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  constructor(private readonly prismaService: PrismaService) {}

  async getSummary() {
    const [
      totalLeads,
      pendingLeads,
      convertedLeads,
      unassignedLeads,
      recentLeads,
      platformStats,
    ] = await this.prismaService.$transaction([
      this.prismaService.lead.count(),
      this.prismaService.lead.count({
        where: {
          status: {
            in: [LeadStatus.NEW, LeadStatus.WAITING, LeadStatus.REPLIED],
          },
        },
      }),
      this.prismaService.lead.count({
        where: { status: LeadStatus.CONVERTED },
      }),
      this.prismaService.lead.count({
        where: { assignedTo: null },
      }),
      // Find 5 customer recent
      this.prismaService.lead.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          customerName: true,
          platform: true,
          status: true,
          createdAt: true,
        },
      }),
      // Statistic platform
      this.prismaService.lead.groupBy({
        by: ['platform'],
        orderBy: { platform: 'asc' },
        _count: { platform: true },
      }),
    ]);
    const chartData = platformStats.map((item) => ({
      name: item.platform,
      value: (item._count as { platform: number }).platform,
    }));

    return {
      cards: { totalLeads, pendingLeads, convertedLeads, unassignedLeads },
      recentLeads,
      chartData,
    };
  }
}
