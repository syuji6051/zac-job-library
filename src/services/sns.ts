import { slack } from '@syuji6051/zac-job-interface';
import { publish } from '../core/sns';

// eslint-disable-next-line import/prefer-default-export
export const publishSnsToSlack = async (topic: string, message: slack.PublishSnsToSlackMessage) => {
  await publish(message, topic);
};
