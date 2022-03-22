import { slack } from '@syuji6051/zac-job-interface';
import { CustomError } from '../core/errors';
import { publishSnsToSlack } from './sns';

// eslint-disable-next-line import/prefer-default-export
export class SlackError extends CustomError {
  static error: SlackError;

  topic: string;

  slackParam: slack.PublishSnsToSlackMessage;

  constructor(topic: string, slackParam: slack.PublishSnsToSlackMessage) {
    super(slackParam.message);
    this.topic = topic;
    this.slackParam = slackParam;
  }

  static async build(topic: string, slackParam: slack.PublishSnsToSlackMessage) {
    this.error = new SlackError(topic, slackParam);
    await publishSnsToSlack(topic, slackParam);
    throw this.error;
  }
}
