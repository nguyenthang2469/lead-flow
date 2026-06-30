import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { isObject } from 'class-validator';

@Catch()
export class HttpExceptionFilter<
  T extends HttpException,
> implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException ? exception.getResponse() : exception;
    const errorMessage =
      isObject(message) && message !== null && 'message' in message
        ? (message as Record<string, unknown>).message
        : message;

    const trace = exception instanceof Error ? exception.stack : undefined;
    this.logger.error(
      `${request.method} ${request.url} failed with status ${status} - ${JSON.stringify(errorMessage)}`,
      trace
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: errorMessage,
    });
  }
}
