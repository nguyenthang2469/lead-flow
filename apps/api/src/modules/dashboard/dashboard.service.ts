import { LeadStatus } from '@/generated/prisma/enums';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  constructor(private readonly prismaService: PrismaService) {}

  async getSummary() {
    const [totalLeads, pendingLeads, convertedLeads] =
      await this.prismaService.$transaction([
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
      ]);

    return { totalLeads, pendingLeads, convertedLeads };
  }
}
