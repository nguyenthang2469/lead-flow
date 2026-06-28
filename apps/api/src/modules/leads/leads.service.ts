import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma } from '@/generated/prisma/client';
import { QueryFilterDto } from './dto/query-filter.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class LeadsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly eventsGateway: EventsGateway
  ) {}

  async getAllLeads(filterDto: QueryFilterDto) {
    const {
      search,
      status,
      platform,
      assignedTo,
      page = 1,
      limit = 10,
    } = filterDto;
    const skip = (page - 1) * limit;
    const where: Prisma.LeadWhereInput = {};

    if (status) where.status = status;
    if (platform) where.platform = platform;
    if (assignedTo) where.assignedTo = assignedTo;

    if (search) {
      where.OR = [
        { customerName: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [totalItems, items] = await Promise.all([
      this.prismaService.lead.count({ where }),
      this.prismaService.lead.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          assignee: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
    ]);

    return {
      items,
      meta: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      },
    };
  }

  async getLeadById(id: string) {
    const lead = await this.prismaService.lead.findUnique({
      where: { id },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        activities: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!lead) {
      throw new NotFoundException(`Lead with ID "${id}" not found`);
    }
    return lead;
  }

  async create(dto: Prisma.LeadCreateInput) {
    return this.prismaService.$transaction(async (tx) => {
      const newLead = await tx.lead.create({ data: dto });

      // Log activity
      await tx.activity.create({
        data: {
          leadId: newLead.id,
          action: `Lead created via ${newLead.platform}`,
        },
      });

      this.eventsGateway.emitNewLead(newLead);
      return newLead;
    });
  }

  async update(id: string, updateLeadDto: UpdateLeadDto) {
    await this.getLeadById(id);

    return this.prismaService.$transaction(async (tx) => {
      const currentLead = await tx.lead.findUnique({ where: { id } });
      const updatedLead = await tx.lead.update({
        where: { id },
        data: updateLeadDto,
      });

      const actions: string[] = [];
      if (
        updateLeadDto.status &&
        updateLeadDto.status !== currentLead?.status
      ) {
        actions.push(
          `Status changed from ${currentLead!.status} to ${updateLeadDto.status}`
        );
      }
      if (
        updateLeadDto.assignedTo &&
        updateLeadDto.assignedTo !== currentLead?.assignedTo
      ) {
        actions.push(`Assigned to staff ID: ${updateLeadDto.assignedTo}`);
      }

      if (actions.length) {
        await tx.activity.create({
          data: {
            leadId: id,
            action: actions.join(','),
          },
        });
      }

      this.eventsGateway.emitLeadUpdated(updatedLead);
      return updatedLead;
    });
  }

  async delete(id: string) {
    await this.getLeadById(id);
    await this.prismaService.lead.delete({ where: { id } });
    this.eventsGateway.emitLeadDeleted(id);
    return { message: 'Lead deleted successfully' };
  }
}
