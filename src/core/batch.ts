import aws from 'aws-sdk';

const batch = new aws.Batch({
  region: process.env.REGION,
});

export {
  // eslint-disable-next-line import/prefer-default-export
  batch,
};
