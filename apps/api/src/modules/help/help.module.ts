import { Global, Module } from '@nestjs/common';
import { HelpService } from './help.service';

@Global()
@Module({
  providers: [HelpService],
  exports: [HelpService],
})
export class HelpModule {}
