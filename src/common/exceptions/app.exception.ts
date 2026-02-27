import { HttpException, HttpStatus } from '@nestjs/common';

export class AppException extends HttpException {
  constructor(
    public readonly errorCode: string,
    message: string,
    status: HttpStatus,
    public readonly errors?: any,
  ) {
    super(
      {
        errorCode,
        message,
        errors: errors || null,
      },
      status,
    );
  }
}