import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { CustomError } from '../responses/custom-error';

@Catch(CustomError)
export class CustomErrorFilter implements ExceptionFilter {
  catch(exception: CustomError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();

    response.status(exception.getStatus()).json({
      status: false,
      message: exception.message,
    });
  }
}
