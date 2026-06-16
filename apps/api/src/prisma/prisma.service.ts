import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client';
import { HelpService } from '../modules/help/help.service';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly config: HelpService) {
    const adapter = new PrismaPg(config.databaseUrl);
    super({
      adapter,
      // log: [
      //   { emit: 'stdout', level: 'query' },
      //   { emit: 'stdout', level: 'info' },
      //   { emit: 'stdout', level: 'warn' },
      //   { emit: 'stdout', level: 'error' },
      // ],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('Connected to Prisma');
    } catch (error) {
      console.error('Error connecting to Prisma:', error);
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
    } catch (error) {
      console.error('Error disconnecting from Prisma:', error);
    }
  }
}
