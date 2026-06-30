import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { HelpService } from '../help/help.service';
import { ApiOperation } from '@nestjs/swagger';
import { MessengerSignatureGuard } from './guards/messenger-signature.guard';

@Controller('webhooks')
export class WebhooksController {
  constructor(
    private readonly webhooksService: WebhooksService,
    private readonly helpService: HelpService
  ) {}

  @Get('messenger')
  @ApiOperation({ summary: 'Verify webhook facebook' })
  verifyMessengerWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string
  ) {
    const VERIFY_TOKEN = this.helpService.messengerVerifyToken;

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      return challenge;
    }

    return 'Forbidden';
  }

  @Post('messenger')
  @UseGuards(MessengerSignatureGuard)
  @ApiOperation({ summary: 'Get webhook from facebook messenger' })
  async handleMessengerWebhook(@Body() payload: any) {
    return this.webhooksService.handleMessengerWebhook(payload);
  }
}
