import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { HelpService } from '../../modules/help/help.service';
import { AppLogger } from './logger.service';
import { createWinstonLoggerOptions } from './winston.config';

@Module({
  imports: [
    WinstonModule.forRootAsync({
      inject: [HelpService],
      useFactory: (helpService: HelpService) =>
        createWinstonLoggerOptions(helpService),
    }),
  ],
  providers: [AppLogger],
})
export class LoggerModule {}
