import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export function unprocessableEntityHandler(errors: ValidationError[]) {
  const humanErrors = errors.map((error: ValidationError): any => {
    return {
      key: error.property,
      message: error.constraints![Object.keys(error.constraints!)[0]],
    };
  });
  throw new HttpException(
    {
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      messages: humanErrors,
      error: 'Unprocessable Entity',
    },
    HttpStatus.UNPROCESSABLE_ENTITY,
  );
}
