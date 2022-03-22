import { z } from 'zod';
import { logger } from '.';

// eslint-disable-next-line import/prefer-default-export
export const check = <T>(schema: z.ZodType<T>, target: any) => {
  const res = schema.safeParse(target);
  if (res.success === false) {
    logger.debug('validate error result value');
    logger.debug(JSON.stringify(res.error.issues));
    logger.error(res.error.message);
    throw new TypeError(JSON.stringify(res.error.issues));
  }
  return res.data;
};
