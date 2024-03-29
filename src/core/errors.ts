/* eslint-disable max-classes-per-file */
import { z } from 'zod';
import logger from './logger';

export class CustomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
  }
}

export class ZodValidateError extends CustomError {
  cause: string[]

  constructor(error: z.ZodError) {
    super(JSON.stringify(error));
    this.cause = error.issues.map((issue) => issue.message);
  }
}

export class Errors extends CustomError {
  errors: Error[]

  constructor(message: string, errors: Error[]) {
    super(message);
    this.errors = errors;
  }

  cause() {
    logger.error(`message: ${this.message}`);
    this.errors.forEach((err, idx) => {
      logger.error(`err index ${idx}: ${err.message}`);
      logger.error(err.stack);
    });
  }
}
