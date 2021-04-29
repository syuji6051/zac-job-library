/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Browser } from 'puppeteer-core';

// eslint-disable-next-line import/prefer-default-export
export async function getBrowser(): Promise<Browser> {
  const IS_DOCKER = process.env.IS_DOCKER === 'true';

  const puppeteer = require('puppeteer');
  return puppeteer.launch(IS_DOCKER ? {
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
    ],
  } : {
    headless: false,
  });
}
