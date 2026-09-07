import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Erro inesperado no servidor';
    let details: string[] | undefined;

    if (exception instanceof HttpException) {
      const body = exception.getResponse();

      if (typeof body === 'string') {
        message = body;
      } else {
        const raw = (body as { message?: string | string[] }).message;

        if (Array.isArray(raw)) {
          message = 'Os dados enviados são inválidos';
          details = raw;
        } else if (raw) {
          message = raw;
        }
      }
    } else {
      this.logger.error(exception);
    }

    response.status(status).json({
      error: { code: HttpStatus[status], message, details },
    });
  }
}
