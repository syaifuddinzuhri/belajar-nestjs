import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomError extends HttpException {
  constructor(message: string) {
    super(
      {
        status: false,
        message: message,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
