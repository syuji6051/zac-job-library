import aws from 'aws-sdk';

const secretId = process.env.SECRET_ID;
const asm = new aws.SecretsManager({
  region: process.env.REGION,
});
// eslint-disable-next-line import/prefer-default-export
export async function getSecretsManager<TSecrets>(): Promise<TSecrets> {
  if (!secretId) throw new Error('SECRET ID is not Found');
  const res = await asm.getSecretValue({
    SecretId: secretId,
  }).promise();
  if (res.SecretString === undefined) throw new Error('secrets values not found');
  return JSON.parse(res.SecretString) as TSecrets;
}
