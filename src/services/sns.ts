import { publish } from '../core/sns';

export interface PublishSnsToSlackMessage {
  token: string
  chanel: string
  message: string
}

export const publishSnsToSlack = async (topic: string, message: PublishSnsToSlackMessage) => {
  await publish(message, topic);
};
