import { Request, Response, NextFunction } from 'express';
import {
  APIGatewayProxyCognitoAuthorizer,
  APIGatewayProxyWithCognitoAuthorizerEvent,
  APIGatewayProxyWithLambdaAuthorizerEvent,
  APIGatewayProxyWithLambdaAuthorizerEventRequestContext,
  APIGatewayRequestAuthorizerEvent,
  EventBridgeEvent,
  S3Event,
} from 'aws-lambda';

export interface CustomAuthorizerRequest extends Request {
  apiGateway?: {
    event: APIGatewayRequestAuthorizerEvent
  }
}

export interface CustomAuthorizerContext {
  userNo?: string
}

export interface CustomRequest extends Request {
  apiGateway?: {
    event: APIGatewayProxyWithLambdaAuthorizerEvent<CustomAuthorizerContext>
  }
}

export interface CustomCognitoRequest extends Request {
  apiGateway?: {
    event: APIGatewayProxyWithCognitoAuthorizerEvent
  }
}

export const apiGatewayEventGenerator = () => (
  req: CustomRequest, _: Response, next: NextFunction,
) => {
  const requestContext: APIGatewayProxyWithLambdaAuthorizerEventRequestContext<
  CustomAuthorizerContext> = {
    accountId: null,
    path: req.path,
    protocol: null,
    stage: req.header('x-mgw-apigateway-stage') || null,
    requestId: req.header('x-apigateway-request-id') || null,
    requestTimeEpoch: null,
    resourcePath: req.header('x-apigateway-resource-path') || null,
    resourceId: req.header('x-apigateway-id'),
    httpMethod: req.header('x-apigateway-http-method') || null,
    apiId: req.header('x-amzn-apigateway-id'),
    authorizer: {
      principalId: null,
      integrationLatency: null,
    },
    identity: {
      user: req.header('x-identity-user'),
      accessKey: null,
      accountId: null,
      apiKey: req.header('x-apigateway-api-key'),
      apiKeyId: null,
      caller: null,
      cognitoAuthenticationProvider: null,
      cognitoAuthenticationType: null,
      cognitoIdentityId: null,
      cognitoIdentityPoolId: null,
      principalOrgId: null,
      sourceIp: req.header('x-apigateway-source-ip') || null,
      userAgent: req.header('x-apigateway-user-agent') || null,
      userArn: req.header('x-apigateway-user-arn') || null,
    },
  };
  const event: APIGatewayProxyWithLambdaAuthorizerEvent<CustomAuthorizerContext> = {
    pathParameters: req.params,
    queryStringParameters: req.query as { [name: string]: string },
    multiValueHeaders: req.headers as { [name: string]: string[] },
    httpMethod: requestContext.httpMethod || req.method,
    isBase64Encoded: req.headers['x-api-gateway-is-base-64-encoded'] === 'true' || false,
    path: req.path,
    multiValueQueryStringParameters: req.headers as { [name: string]: string[] },
    body: JSON.stringify(req.body),
    headers: req.headers as { [name: string]: string },
    stageVariables: null,
    resource: requestContext.resourcePath || req.path,
    requestContext,
  };
  req.apiGateway = {
    event,
  };
  return next();
};

export const apiGatewayCognitoEventGenerator = () => (
  req: CustomCognitoRequest, _: Response, next: NextFunction,
) => {
  const authorizer: APIGatewayProxyCognitoAuthorizer = {
    claims: {
      'cognito:username': req.header('x-apigateway-cognito-username'),
    },
  };

  const requestContext = {
    accountId: null,
    path: req.path,
    protocol: null,
    stage: req.header('x-mgw-apigateway-stage') || null,
    requestId: req.header('x-apigateway-request-id') || null,
    requestTimeEpoch: null,
    resourcePath: req.header('x-apigateway-resource-path') || null,
    resourceId: req.header('x-apigateway-id'),
    httpMethod: req.header('x-apigateway-http-method') || null,
    apiId: req.header('x-amzn-apigateway-id'),
    authorizer,
    identity: {
      user: req.header('x-identity-user'),
      accessKey: null,
      accountId: null,
      apiKey: req.header('x-apigateway-api-key'),
      apiKeyId: null,
      caller: null,
      cognitoAuthenticationProvider: null,
      cognitoAuthenticationType: null,
      cognitoIdentityId: null,
      cognitoIdentityPoolId: null,
      principalOrgId: null,
      sourceIp: req.header('x-apigateway-source-ip') || null,
      userAgent: req.header('x-apigateway-user-agent') || null,
      userArn: req.header('x-apigateway-user-arn') || null,
    },
  };
  const event: APIGatewayProxyWithCognitoAuthorizerEvent = {
    pathParameters: req.params,
    queryStringParameters: req.query as { [name: string]: string },
    multiValueHeaders: req.headers as { [name: string]: string[] },
    httpMethod: requestContext.httpMethod || req.method,
    isBase64Encoded: req.headers['x-api-gateway-is-base-64-encoded'] === 'true' || false,
    path: req.path,
    multiValueQueryStringParameters: req.headers as { [name: string]: string[] },
    body: JSON.stringify(req.body),
    headers: req.headers as { [name: string]: string },
    stageVariables: null,
    resource: requestContext.resourcePath || req.path,
    requestContext,
  };
  req.apiGateway = {
    event,
  };
  return next();
};

export function eventBridgeEventGenerator(req: Request): EventBridgeEvent<string, {}> {
  return {
    id: '',
    version: '',
    account: '',
    time: '',
    region: process.env.REGION,
    resources: [''],
    source: '',
    detail: {
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    },
    'detail-type': 'Scheduled Event',
  };
}

export function s3EventGenerator(req: Request): S3Event {
  const { key, bucketName } = req.body;
  return {
    Records: [{
      eventVersion: '',
      eventSource: '',
      awsRegion: '',
      eventTime: '',
      eventName: '',
      userIdentity: {
        principalId: '',
      },
      requestParameters: {
        sourceIPAddress: '',
      },
      responseElements: {
        'x-amz-request-id': '',
        'x-amz-id-2': '',
      },
      s3: {
        s3SchemaVersion: '',
        configurationId: '',
        bucket: {
          name: bucketName,
          ownerIdentity: {
            principalId: '',
          },
          arn: '',
        },
        object: {
          key,
          size: 0,
          eTag: '',
          sequencer: '',
        },
      },
    }],
  };
}
