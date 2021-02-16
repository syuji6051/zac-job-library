/* eslint-disable max-classes-per-file */
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

export class ValidationError extends CustomError {
  code: string

  status: number

  cause: Error

  constructor(message: string) {
    super(message);
    this.code = 'invalid_request';
    this.status = 400;
  }
}
