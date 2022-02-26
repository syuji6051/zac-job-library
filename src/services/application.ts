/* eslint-disable no-unused-vars */
import { APIGatewayProxyEventV2, APIGatewayProxyResult } from 'aws-lambda';
import { lambdaErrorHandler } from '../middleware/lambda-error-handler';
import logger from '../core/logger';

type ApplicationFunc = (
  input: any, output: any
) => Promise<APIGatewayProxyResult>

class Application {
  name: string;

  asyncModules: Promise<void>;

  runner: Promise<APIGatewayProxyResult>;

  constructor(name: string, runner: Promise<APIGatewayProxyResult>, asyncModules: Promise<void>) {
    this.name = name;
    this.asyncModules = asyncModules;
    this.runner = runner;
  }

  async run(event: APIGatewayProxyEventV2) {
    logger.info(`function ${this.name} start`);
    return this.asyncModules.then(async () => {
      logger.info(JSON.stringify(event));
      return this.runner
        .then((res) => {
          logger.info(`function ${this.name} success`);
          return res;
        })
        .catch((err: Error) => lambdaErrorHandler(err))
        .finally(() => {
          logger.info(`function ${this.name} end`);
        });
    });
  }
}

export {
  // eslint-disable-next-line import/prefer-default-export
  Application,
};
