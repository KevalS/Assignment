import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as _ from 'lodash';

// extremely needed do not remove this as it can break your whole frontend
@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap((data) => {
        const res = context.switchToHttp().getResponse();
        if (_.get(data, 'status', undefined)) res.statusCode = data.status;

        // handle exceptions
        if (_.get(data, 'message.error')) {
          data.message = data.message.error;
        }
      }),
    );
  }
}
