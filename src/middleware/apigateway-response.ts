import { APIGatewayProxyResult } from 'aws-lambda';
import logger from '../core/logger';

export function success(body?: any): APIGatewayProxyResult {
  return {
    statusCode: 200,
    body: JSON.stringify(body || {}),
    headers: {
      'Access-Control-Allow-Origin': '*',
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
    },
  };
}
