import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { AppException } from "../exceptions/app.exception";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let errorCode = 'INTERNAL_SERVER_ERROR';
    let message = 'Internal server error';
    let errors: any[] | null = null;

    if (exception instanceof AppException) {
      errorCode = exception.errorCode;
      message = exception.message;
      errors = exception.errors;
    } else if (exception instanceof HttpException) {
      const res = exception.getResponse();

      if (typeof res === 'object') {
        message = res['message'] || message;
        errors = Array.isArray(res['message']) ? res['message'] : null;
      } else {
        message = res;
      }
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      errorCode,
      message,
      errors,
      timestamp: new Date().toISOString(),
    });
  }
}