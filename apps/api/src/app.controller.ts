import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from '@/common/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @Public()
  getHello(): string {
    return 'OK';
  }

  @Get('test-error')
  @Public()
  testError(): void {
    throw new Error('This is a test error with stack trace for Telegram alert');
  }
}
