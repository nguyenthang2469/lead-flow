import { MESSENGER_SIGNATURE_HEADER } from '@/common/constants/auth.constant';
import { HelpService } from '@/modules/help/help.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  RawBodyRequest,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import * as crypto from 'crypto';

@Injectable()
export class MessengerSignatureGuard implements CanActivate {
  private readonly logger = new Logger(MessengerSignatureGuard.name);

  constructor(private readonly helpService: HelpService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<RawBodyRequest<Request>>();

    const signature = request.headers[MESSENGER_SIGNATURE_HEADER] as string;

    if (!signature) {
      this.logger.warn('Facebook Webhook missing signature');
      throw new UnauthorizedException('Missing signature');
    }

    const appSecret = this.helpService.messengerAppSecret;
    if (!appSecret) {
      this.logger.warn(
        'MESSENGER_APP_SECRET is not configured. Skipping validation.'
      );
      return true;
    }

    const signatureHash = signature.split('=')?.[1];
    const expectedHash = crypto
      .createHmac('sha256', appSecret)
      .update(request.rawBody || '')
      .digest('hex');

    if (signatureHash !== expectedHash) {
      this.logger.error('Invalid Facebook webhook signature');
      throw new UnauthorizedException('Invalid signature');
    }

    return true;
  }
}
