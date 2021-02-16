import * as winston from 'winston';

const logger = winston.createLogger();

logger.configure({
  level: process.env.LOG_LEVEL || 'debug',
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),
  ],
});

export default logger;
