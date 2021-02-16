import puppeteer, { Browser } from 'puppeteer';

// eslint-disable-next-line import/prefer-default-export
export async function getBrowser(): Promise<Browser> {
  const IS_DOCKER = process.env.IS_DOCKER === 'true';

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
