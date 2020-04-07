import * as puppeteer from 'puppeteer-core';

export interface Work {
  clockIn: string;
  clockOut: string;
  goOut1: string;
  returned1: string;
  goOut2: string;
  returned2: string;
  goOut3: string;
  returned3: string;
  day: string;
}

export class ObcClient {
  constructor(Page: puppeteer.Page, userId: String, password: String, debug?: boolean);
  login(): Promise<void>;
  clockIn(): Promise<void>;
  clockOut(): Promise<void>;
  goOut(): Promise<void>;
  returned(): Promise<void>;
  getWorkList(): Promise<Work[]>
}
