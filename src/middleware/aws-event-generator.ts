import { Request } from 'express';
import {
  EventBridgeEvent,
  S3Event,
} from 'aws-lambda';

export function apiGatewayEventGenerator<EventT>(req: Request): EventT {
  const requestContext = <any>{
    resourceId: req.headers['x-express-resource-id'],
    apiId: req.headers['x-amzn-api-id'],
    authorizer: {
      claims: {
        'cognito:username': req.headers['x-identity-user'],
      },
    },
    identity: {
      user: req.headers['x-identity-user'],
    },
  };
  return {
    pathParameters: req.params,
    queryStringParameters: req.query,
    body: JSON.stringify(req.body),
    requestContext,
  } as any;
}

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
