import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { isValidJSON } from '../functions';

@Catch()
export class BadRequestErrorFilter implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      error instanceof HttpException
        ? error.getStatus()
        : HttpStatus.BAD_REQUEST;

    const msg = isValidJSON(error.message)
      ? JSON.parse(error.message)
      : error.message;
    response.status(status).json({
      status: false,
      message: msg,
    });
  }
}
