import * as url from 'url';
import { Page } from 'puppeteer';
import * as winston from 'winston';

const OBC_BASE_URL = 'https://id.obc.jp/pj35b01flra8';
const logger = winston.createLogger();


export default class ObcClient {
  page: Page;
  loginId: string;
  password: string;
  constructor(page: Page, loginId: string, password: string, debug: boolean = false) {
    this.page = page;
    this.loginId = loginId;
    this.password = password;
    logger.configure({
      level: debug ? 'debug' : 'info',
      format: winston.format.simple(),
      transports: [
        new winston.transports.Console()
      ]
    })
  }
  async login() {
    logger.debug('login process start');
    await this.page.goto(`${OBC_BASE_URL}`);
    await this.page.waitForSelector('#body-main');

    await this.page.type('input[id="OBCID"]', this.loginId);
    await this.page.click('#checkAuthPolisyBtn');

    await this.page.waitForSelector('#Password');
    await this.page.type('input[id="Password"]', this.password);
    await this.page.click('#login');

    await this.page.waitForSelector('#js-timeRecorder__digitalClock');
    logger.debug('login process success');
  }

  async clockIn() {
    logger.debug('clockIn process start');
    await this.page.waitForSelector('#js-timeRecorder__digitalClock');

    await this.page.click('#js-punchTypeButton--clockIn');
    await this.page.click('#js-punchButton');
    logger.debug('clockIn process end');
  }

  async clockOut() {
    logger.debug('clockOut process start');
    await this.page.waitForSelector('#js-timeRecorder__digitalClock');

    await this.page.click('#js-punchTypeButton--clockOut');
    await this.page.click('#js-punchButton');
    logger.debug('clockOut process end');
  }

  async goOut() {
    logger.debug('goOut process start');
    await this.page.waitForSelector('#js-timeRecorder__digitalClock');

    await this.page.click('#js-punchTypeButton--goOut');
    await this.page.click('#js-punchButton');
    logger.debug('goOut process end');
  }

  async returned() {
    logger.debug('returned process start');
    await this.page.waitForSelector('#js-timeRecorder__digitalClock');

    await this.page.click('#js-punchTypeButton--returned');
    await this.page.click('#js-punchButton');
    logger.debug('returned process end');
  }

  async getWorkList() {
    logger.debug('getWorkList process start');
    await this.page.waitForSelector('#js-timeRecorder__digitalClock')
    const base = this.getSessionUrl();

    await this.page.goto(`${base}/inquirylaborresult/reference`);
    await this.page.waitForSelector('#js-laborTimeTable');
    await this.page.waitForSelector('.cm-p-scrollTable__vScrollBodyTd');

    const tables = await this.page.$$('.cm-p-scrTblTr');

    const works = await Promise.all(tables.map(async table => {
      const day = await table.$eval('.cm-p-scrTbl_app_tr', res => res.getAttribute('data-key'));
      const clockIn = await table.$eval('.js-cm-scrTbl__colIdx5', res => res.getAttribute('title'));
      const clockOut = await table.$eval('.js-cm-scrTbl__colIdx6', res => res.getAttribute('title'));
      const goOut1 = await table.$eval('.js-cm-scrTbl__colIdx7', res => res.getAttribute('title'));
      const returned1 = await table.$eval('.js-cm-scrTbl__colIdx8', res => res.getAttribute('title'));
      const goOut2 = await table.$eval('.js-cm-scrTbl__colIdx9', res => res.getAttribute('title'));
      const returned2 = await table.$eval('.js-cm-scrTbl__colIdx10', res => res.getAttribute('title'));
      const goOut3 = await table.$eval('.js-cm-scrTbl__colIdx11', res => res.getAttribute('title'));
      const returned3 = await table.$eval('.js-cm-scrTbl__colIdx12', res => res.getAttribute('title'));

      return {
        clockIn, clockOut,
        goOut1, returned1,
        goOut2, returned2,
        goOut3, returned3,
        day: day.substr(0, 8),
      };
    }));

    logger.debug('getWorkList process end');
    return works;
  }

  getSessionUrl() {
    const pageUrl = url.parse(this.page.url());
    const baseUrl = pageUrl.path.split('/').slice(0, 3).join('/');
    return `${pageUrl.protocol}//${pageUrl.host}/${baseUrl}`;
  }
}
