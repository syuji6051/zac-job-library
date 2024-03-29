import logger from '../core/logger';

class Application<LambdaEventType> {
  name: string;

  runner: Promise<void>;

  constructor(name: string, runner: Promise<void>) {
    this.name = name;
    this.runner = runner;
  }

  async run(event: LambdaEventType) {
    logger.info(`function ${this.name} start`);
    logger.info(JSON.stringify(event));
    return this.runner
      .then((res) => {
        logger.info(`function ${this.name} success`);
        return res;
      })
      .finally(() => {
        logger.info(`function ${this.name} end`);
      });
  }
}

export default Application;
