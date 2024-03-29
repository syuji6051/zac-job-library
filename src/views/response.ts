import { APIGatewayAuthorizerResult, APIGatewayProxyResult } from 'aws-lambda';
import { ZodValidateError } from '../core/errors';
import logger from '../core/logger';

export function success(body?: any): APIGatewayProxyResult {
  return {
    statusCode: 200,
    body: JSON.stringify(body || {}),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
  };
}

export const authorizerResponse = (
  principalId: string,
  methodArn: string,
  isSufficientScope: boolean = true,
  context: { [name: string]: string} = {},
): APIGatewayAuthorizerResult => ({
  principalId,
  policyDocument: {
    Version: '2012-10-17',
    Statement: [{
      Effect: isSufficientScope ? 'Allow' : 'Deny',
      Action: 'execute-api:Invoke',
      Resource: methodArn,
    }],
  },
  context,
});

export function invalidErrorResponse(error: ZodValidateError): APIGatewayProxyResult {
  const { message, cause } = error;
  return {
    statusCode: 400,
    body: JSON.stringify({
      code: 'invalid_request', message, cause,
    }),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
  };
}

export function serverErrorResponse(error: Error): APIGatewayProxyResult {
  logger.error('response server error');
  logger.info(error.stack);
  return {
    statusCode: 500,
    body: JSON.stringify({
      code: 'server_error',
      message: error.message,
    }),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
  };
}
