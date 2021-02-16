import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const ENCODING = 'base64';
const iv = 'a2xhcgAAAAAAAAAA';

export function encrypt(encryptKey: string, encryptSaltKey: string, message: string) {
  if (!encryptKey || !encryptSaltKey) {
    throw new Error('ENCRYPT_KEY or ENCRYPT_SALT_KEY is not found');
  }
  const key = crypto.scryptSync(encryptKey, encryptSaltKey, 32);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encryptedData = cipher.update(Buffer.from(message));
  return Buffer.concat([encryptedData, cipher.final()]).toString(ENCODING);
}

export function decrypt(encryptKey: string, encryptSaltKey: string, encrypted: string) {
  if (!encryptKey || !encryptSaltKey) {
    throw new Error('ENCRYPT_KEY or ENCRYPT_SALT_KEY is not found');
  }
  const key = crypto.scryptSync(encryptKey, encryptSaltKey, 32);
  const buff = Buffer.from(encrypted, 'base64');
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  const decryptData = decipher.update(buff);
  return Buffer.concat([decryptData, decipher.final()]).toString();
}
