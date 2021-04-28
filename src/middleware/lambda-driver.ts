/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import {
  APIGatewayProxyResult,
  APIGatewayProxyWithLambdaAuthorizerEvent,
  APIGatewayRequestAuthorizerWithContextHandler, Context, EventBridgeEvent, Handler, S3Event,
} from 'aws-lambda';
import {
  CustomAuthorizerContext,
  CustomAuthorizerRequest, CustomRequest, eventBridgeEventGenerator, s3EventGenerator,
} from './aws-event-generator';

const context: Partial<Context> = {
  callbackWaitsForEmptyEventLoop: true,
  getRemainingTimeInMillis: () => 0,
};

const lambdaDriver = (
  controller:
    Handler<APIGatewayProxyWithLambdaAuthorizerEvent<CustomAuthorizerContext>,
    APIGatewayProxyResult>,
) => async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const {
      body = JSON.stringify({}),
      statusCode = 200,
    } = await controller(
      req.apiGateway.event, context as Context, undefined,
    ) as APIGatewayProxyResult;
    res.status(statusCode)
      .send(JSON.parse(body));
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const lambdaAuthorizerDriver = (
  controller: APIGatewayRequestAuthorizerWithContextHandler<any>,
) => async (req: CustomAuthorizerRequest, res: Response, next: NextFunction) => {
  console.log(req.apiGateway);
  try {
    const results = await controller(req.apiGateway.event, context as Context, undefined);
    console.log(results);
    if (typeof results === 'object') {
      if (results.policyDocument.Statement[0].Effect === 'Deny') {
        next(createError(
          403, 'insufficient_scope', 'The scope of the access token is insufficient or invalid.',
        ));
      }
      req.apiGateway.event.requestContext = {
        ...req.apiGateway.event.requestContext,
        authorizer: results.context,
      };
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
  next();
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
  lambdaAuthorizerDriver,
  lambdaDriverWithEventsBride,
  lambdaDriverWithS3Event,
};
