import { publish } from '../core/sns';
import { PublishSnsToSlackMessage } from '../../interface/src/slack';

// eslint-disable-next-line import/prefer-default-export
export const publishSnsToSlack = async (topic: string, message: PublishSnsToSlackMessage) => {
  await publish(message, topic);
};
