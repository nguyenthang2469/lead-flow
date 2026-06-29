import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HelpService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * get environment variable.
   * @param key name of environment variable
   * @param defaultValue default value if environment variable is not set
   * @returns value of environment variable or default value
   */
  getEnv(key: string, defaultValue?: string): string {
    const value = this.configService.get<string>(key);
    if (!value && defaultValue !== undefined) {
      return defaultValue;
    }
    if (!value) {
      throw new Error(`Environment variable ${key} is not set`);
    }
    return value;
  }

  get appPort() {
    return this.getEnv('PORT', '3000');
  }

  get frontendUrl(): string {
    return this.getEnv('FRONTEND_URL');
  }

  get databaseUrl(): string {
    return this.getEnv('DATABASE_URL');
  }

  get telegramInfo() {
    const botToken = this.getEnv('TELEGRAM_BOT_TOKEN', '');
    const chatId = this.getEnv('TELEGRAM_CHAT_ID', '');
    const logLevel = this.getEnv('TELEGRAM_LOG_LEVEL', 'info');
    return { botToken, chatId, logLevel };
  }

  get logLevel(): string {
    return this.getEnv('LOG_LEVEL', 'info');
  }

  get jwtAccessToken() {
    const expiresInMs =
      Number(this.getEnv('JWT_ACCESS_TOKEN_EXPIRATION_MS')) || 300_000;
    return {
      secret: this.getEnv('JWT_ACCESS_TOKEN_SECRET'),
      expiresInMs,
      expiresInSeconds: Math.floor(expiresInMs / 1000),
    };
  }
}
