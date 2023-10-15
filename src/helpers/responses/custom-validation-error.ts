import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomValidationError extends HttpException {
  constructor(validationErrors: any[]) {
    super(
      {
        status: false,
        message: validationErrors,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
