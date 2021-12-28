import aws from 'aws-sdk';

const { STAGE } = process.env;

const snsInstance = new aws.SNS();

const publish = async <T>(data: T, topicArn: string) => {
  await snsInstance.publish({
    TopicArn: topicArn,
    Message: JSON.stringify(data),
    MessageAttributes: {
      stage: {
        DataType: 'String',
        StringValue: STAGE,
      },
    },
  }).promise();
};

export {
  snsInstance,
  publish,
};
