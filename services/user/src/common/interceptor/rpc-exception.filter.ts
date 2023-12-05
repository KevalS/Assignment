import { Catch, RpcExceptionFilter } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import * as _ from 'lodash';

@Catch()
export class CustomExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException): Observable<any> {
    const error = { message: '', statusCode: 500, stack: '' };
    error.message = _.get(exception, 'message');
    error.statusCode =
      _.get(exception, 'status') || _.get(exception, 'error.statusCode') || 422;
    error.stack = _.get(exception, 'stack', '');
    return throwError(() => error);
  }
}
