import { AxiosRequestConfig } from 'axios';
import { sign } from 'aws4';

const SERVICE_NAME = 'execute-api';

export interface SigningOptions {
  host?: string;
  headers?: {};
  path?: string;
  body?: any;
  region?: string;
  service?: string;
  signQuery?: boolean;
  method?: string;
}

// eslint-disable-next-line import/prefer-default-export
export const setSig4AuthHeader = (
  config: AxiosRequestConfig, accessKeyId?: string, secretAccessKey?: string,
) => {
  if (!config.url) {
    throw new Error('No URL present in request config, unable to sign request');
  }

  let signQuery: boolean | undefined;
  const { host, pathname, search } = new URL(config.url);
  const { data, headers, method } = config;

  const transformRequest = getTransformer(config);
  const transformedData = transformRequest(data, headers);

  // Remove all the default Axios headers
  const {
    common,
    delete: _delete, // 'delete' is a reserved word
    get,
    head,
    post,
    put,
    patch,
    ...headersToSign
  } = headers;

  const options: SigningOptions = {
    method: method && method.toUpperCase(),
    host,
    path: pathname + search,
    region: process.env.region,
    service: SERVICE_NAME,
    ...(signQuery !== undefined ? { signQuery } : {}),
    body: transformedData,
    headers: headersToSign,
  };

  sign(options, {
    accessKeyId, secretAccessKey,
  });
  return options.headers;
};

const getTransformer = (config: AxiosRequestConfig) => {
  const { transformRequest } = config;

  if (transformRequest) {
    if (typeof transformRequest === 'function') {
      return transformRequest;
    } if (transformRequest.length) {
      return transformRequest[0];
    }
  }

  throw new Error(
    'Could not get default transformRequest function from Axios defaults',
  );
};
