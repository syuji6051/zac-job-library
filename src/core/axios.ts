import axios from 'axios';
import { logger, sig4 } from '.';

const request = axios;
request.interceptors.request.use((c) => {
  logger.debug(`request url: ${c.url}`);
  logger.debug(`request method: ${c.method}`);
  logger.debug(`request header: ${c.headers}`);
  logger.debug(`request data: ${c.data}`);
  return c;
});
request.interceptors.response.use((res) => {
  logger.debug(`response url: ${res.request.url}`);
  logger.debug(`response status: ${res.status}`);
  logger.debug(`response headers: ${res.headers}`);
  logger.debug(`response data: ${res.data}`);
  return res;
});

const sig4Request = axios.create();
sig4Request.interceptors.request.use((c) => {
  const headers = sig4.setSig4AuthHeader(c);
  // eslint-disable-next-line no-param-reassign
  c.headers = headers;
  logger.debug(`request url: ${c.url}`);
  logger.debug(`request method: ${c.method}`);
  logger.debug(`request header: ${JSON.stringify(c.headers)}`);
  logger.debug(`request data: ${JSON.stringify(c.data)}`);
  return c;
});
sig4Request.interceptors.response.use((res) => {
  logger.debug(`response url: ${res.request.url}`);
  logger.debug(`response status: ${res.status}`);
  logger.debug(`response headers: ${JSON.stringify(res.headers)}`);
  logger.debug(`response data: ${(typeof (res.data) === 'object') ? JSON.stringify(res.data) : res.data}`);
  return res;
}, (err) => {
  logger.debug(`error response ${err}`);
  return Promise.reject(err);
});

export {
  request,
  sig4Request,
};
