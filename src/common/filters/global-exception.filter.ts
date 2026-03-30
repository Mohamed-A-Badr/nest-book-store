import {
  Catch,
  ExceptionFilter,
  ArgumentMetadata,
  HttpException,
  Logger,
  ArgumentsHost,
} from '@nestjs/common';
import { Response } from 'express';
import { I18nService } from 'nestjs-i18n';
import { EntityNotFoundError } from 'typeorm';

@Catch(HttpException, EntityNotFoundError)
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(private i18n: I18nService) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    let status = 500;
    let messageKey = 'error.internal_server_error';
    let messageArgs = {};

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseMesssage = exception.getResponse();

      if (typeof responseMesssage === 'string') {
        messageKey = responseMesssage;
      } else if ((responseMesssage as any).message) {
        messageKey = (responseMesssage as any).message;
      }
    } else if (exception instanceof EntityNotFoundError) {
      status = 404;
      messageKey = 'error.entity_not_found';
      messageArgs = { entity: exception.name };
    }

    const message = await this.i18n.translate(messageKey, {
      lang: request.headers['accept-language'] || 'en',
      args: messageArgs,
    });

    this.logger.error(`${request.method} ${request.url} - ${exception}`);

    response.status(status).json({
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
