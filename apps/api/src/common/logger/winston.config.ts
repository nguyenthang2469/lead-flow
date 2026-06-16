import 'winston-daily-rotate-file';

import * as winston from 'winston';
import { utilities as nestWinstonUtilities } from 'nest-winston';
import { HelpService } from '../../modules/help/help.service';
import TelegramLogger from 'winston-telegram';

const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

export const createWinstonLoggerOptions = (
  helpService: HelpService
): winston.LoggerOptions => {
  const logLevel = helpService.logLevel;
  const telegramLogLevel = helpService.telegramInfo.logLevel;
  const telegramBotToken = helpService.telegramInfo.botToken;
  const telegramChatId = helpService.telegramInfo.chatId;

  return {
    level: logLevel,
    format: fileFormat,
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }),
          winston.format.ms(),
          nestWinstonUtilities.format.nestLike('API', {
            colors: true,
            prettyPrint: true,
            processId: true,
          })
        ),
      }),

      // Telegram alert transport (optional; active only if env vars provided)
      ...(telegramBotToken && telegramChatId
        ? [
            new TelegramLogger({
              token: telegramBotToken,
              chatId: Number(telegramChatId),
              level: telegramLogLevel,
              unique: true,
              formatMessage: (
                params: TelegramLogger.FormatOptions,
                info: {
                  trace?: string;
                  stack?: string;
                  error?: { stack?: string };
                }
              ) => {
                const { level, message } = params;

                // Extract stack trace from info object
                // logger.error() passes trace in metadata, which gets merged into info
                const stackTrace =
                  info.trace || info.stack || info.error?.stack || '';
                const stack = stackTrace ? `\n\n${stackTrace}` : '';
                const fullMessage = `[${level.toUpperCase()}] ${message}${stack}`;

                // Truncate to 4000 chars for Telegram API limit
                return fullMessage.length > 4000
                  ? fullMessage.slice(0, 3990) + '...(truncated)'
                  : fullMessage;
              },
            }),
          ]
        : []),

      // Daily rotated JSON logs for production/aggregation
      new winston.transports.DailyRotateFile({
        dirname: 'logs',
        filename: 'application-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxFiles: '14d',
        format: fileFormat,
      }),

      new winston.transports.DailyRotateFile({
        dirname: 'logs',
        filename: 'error-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        level: 'error',
        zippedArchive: true,
        maxFiles: '30d',
        format: fileFormat,
      }),
    ],
  };
};
