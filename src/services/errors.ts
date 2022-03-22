import { slack } from '@syuji6051/zac-job-interface';
import { CustomError } from '../core/errors';
import { publishSnsToSlack } from './sns';

// eslint-disable-next-line import/prefer-default-export
export class SlackError extends CustomError {
  topic: string;

  slackParam: slack.PublishSnsToSlackMessage;

  constructor(topic: string, slackParam: slack.PublishSnsToSlackMessage) {
    super(slackParam.message);
    this.topic = topic;
    this.slackParam = slackParam;
  }

  static async build(topic: string, slackParam: slack.PublishSnsToSlackMessage) {
    await publishSnsToSlack(topic, slackParam);
    throw new SlackError(topic, slackParam);
  }
}
