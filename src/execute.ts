import * as puppeteer from 'puppeteer';
import obcClient from '../obc-client';

(async () => {
  const browser = await puppeteer.launch({
    headless: false
  });

  console.log('call start');
  const page = await browser.newPage();
  const obc = new obcClient(page, '70', 'Syuji6051', true);
  try {
    await obc.login();
    await obc.getWorkList();
    // await obc.clockOut();

  } catch (err) {
    console.log(err);
    // console.log('zac登録失敗！');
  } finally {
    await page.close();
    console.log('call end');
  }
})();
