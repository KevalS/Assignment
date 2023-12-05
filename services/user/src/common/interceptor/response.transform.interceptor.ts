import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as _ from 'lodash';
// import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      // catchError((data) => {
      //   console.log(data, 'in inter')
      //   throw new RpcException(data)
      // }),
      tap((data) => {
        const res = context.switchToHttp().getResponse();
        delete data.password;
        if (_.get(data, 'status', undefined)) res.statusCode = data.status;
      }),
    );
  }
}
