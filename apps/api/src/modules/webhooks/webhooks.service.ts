import { Injectable, Logger } from '@nestjs/common';
import { LeadsService } from '../leads/leads.service';
import { TFacebookWebhookPayload } from '@/common/types';
import { PrismaService } from '@/prisma/prisma.service';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly leadsService: LeadsService,
    private readonly eventsGateway: EventsGateway
  ) {}

  handleMessengerWebhook(payload: TFacebookWebhookPayload) {
    return { success: true };
  }
}
