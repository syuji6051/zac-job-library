import { z } from 'zod';
import { logger } from '.';
import { ZodValidateError } from './errors';

// eslint-disable-next-line import/prefer-default-export
export const check = <T>(schema: z.ZodType<T>, target: any) => {
  const res = schema.safeParse(target);
  if (res.success === false) {
    logger.debug('validate error result value');
    logger.debug(JSON.stringify(res.error.issues));
    logger.error(res.error.message);
    throw new ZodValidateError(res.error);
  }
  return res.data;
};
