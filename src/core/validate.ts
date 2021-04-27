import { ValidateFunction } from 'ajv';
import { logger } from '.';

// eslint-disable-next-line import/prefer-default-export
export const check = (validate: ValidateFunction, targetObject: any) => {
  const res = validate(targetObject);
  if (!res) {
    logger.debug('validate error result value');
    logger.debug(JSON.stringify(validate.errors));
    const errorMessage = validate.errors
      ? `request miss match ${validate.errors.map((e) => e.message).join()}`
      : 'request miss match';
    logger.error(errorMessage);
    throw new TypeError(errorMessage);
  }
  return res;
};
