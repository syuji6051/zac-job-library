/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import { Request, Response, NextFunction } from 'express';
import {
  APIGatewayAuthorizerEvent,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyWithCognitoAuthorizerEvent, Context, EventBridgeEvent, Handler, S3Event,
} from 'aws-lambda';
import { apiGatewayEventGenerator, eventBridgeEventGenerator, s3EventGenerator } from './aws-event-generator';

const context: Partial<Context> = {
  callbackWaitsForEmptyEventLoop: true,
  getRemainingTimeInMillis: () => 0,
};

const lambdaDriver = <EventT>(
  controller: Handler<EventT, APIGatewayProxyResult>,
) => async (req: Request, res: Response, next: NextFunction) => {
    const event = apiGatewayEventGenerator<EventT>(req);
    try {
      const {
        body = JSON.stringify({}),
        statusCode = 200,
      } = await controller(event, context as Context, undefined) as APIGatewayProxyResult;
      res.status(statusCode)
        .send(JSON.parse(body));
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

const lambdaDriverWithEventsBride = (
  controller: Handler<EventBridgeEvent<string, {}>, Promise<void>>,
) => async (req: Request, res: Response, next: NextFunction) => {
  const event = eventBridgeEventGenerator(req);
  try {
    await controller(event, context as Context, undefined);
    res.status(200)
      .send({});
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const lambdaDriverWithS3Event = (
  controller: Handler<S3Event, void>,
) => async (req: Request, res: Response, next: NextFunction) => {
  const event = s3EventGenerator(req);
  try {
    await controller(event, context as Context, undefined);
    res.status(200)
      .send({});
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export {
  lambdaDriver,
  lambdaDriverWithEventsBride,
  lambdaDriverWithS3Event,
};
