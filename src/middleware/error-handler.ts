import { NextFunction, Request, Response } from 'express';

function errorHandler() {
  return (error: any, _request: Request, response: Response, next: NextFunction) => {
    const status = error.status || 500;
    if (error) {
      response
        .status(status)
        .send({
          code: 'server_error',
          message: error.message,
        });
    } else {
      next(error);
    }
  };
}

export {
  // eslint-disable-next-line import/prefer-default-export
  errorHandler,
};
