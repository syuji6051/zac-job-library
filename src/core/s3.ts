import aws from 'aws-sdk';

const s3instance = new aws.S3();

export {
  // eslint-disable-next-line import/prefer-default-export
  s3instance,
};
