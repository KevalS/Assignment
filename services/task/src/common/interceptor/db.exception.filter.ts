import { Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { throwError } from 'rxjs';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class DBExceptionFilter implements ExceptionFilter {
  catch(exception: any) {
    switch (exception.code) {
      default: {
        Logger.log(exception.message);
        const error = {
          message: 'Unknown DataBase Error',
          statusCode: 500,
          stack: '',
        };
        return throwError(() => error);
      }
    }
  }
}
