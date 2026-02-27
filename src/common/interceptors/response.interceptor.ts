import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse();
    const request = httpContext.getRequest();

    return next.handle().pipe(
      map((body) => {
        if (body?.success !== undefined && body?.timestamp) {
          return body;
        }

        if (body instanceof Buffer || body?.pipe) {
          return body;
        }

        const statusCode = response.statusCode;

        const message =
          typeof body?.message === 'string'
            ? body.message
            : 'Thành công';

        const data =
          body && typeof body === 'object' && 'data' in body
            ? body.data
            : body;

        const meta =
          body && typeof body === 'object' && 'meta' in body
            ? body.meta
            : null;

        return {
          success: true,
          statusCode,
          message,
          data,
          meta,
          timestamp: new Date().toISOString(),
          path: request.url
        };
      }),
    );
  }
}