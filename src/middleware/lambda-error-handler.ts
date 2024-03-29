import { invalidErrorResponse } from '../views';
import { ZodValidateError } from '../core/errors';
import { serverErrorResponse } from './apigateway-response';

// eslint-disable-next-line import/prefer-default-export
export const lambdaErrorHandler = (err: any) => {
  switch (err.constructor) {
    case ZodValidateError:
    case TypeError:
      return invalidErrorResponse(err);
    default:
      return serverErrorResponse(err);
  }
};
