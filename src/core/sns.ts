import aws from 'aws-sdk';

const snsInstance = new aws.SNS();

export {
  // eslint-disable-next-line import/prefer-default-export
  snsInstance,
};
