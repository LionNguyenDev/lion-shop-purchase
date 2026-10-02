import { createHash } from 'node:crypto';
import { serverEnv } from './env';
import { HttpError } from './http';

const ALLOWED_FORMATS = 'jpg,jpeg,png,webp,avif,gif';

/**
 * Signs a direct browser-to-Cloudinary upload. The API secret never leaves the server and
 * Cloudinary rejects the upload if the folder or allowed formats are tampered with.
 * https://cloudinary.com/documentation/authentication_signatures
 */
export function signImageUpload() {
  const { cloudName, apiKey, apiSecret, folder } = serverEnv.cloudinary;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new HttpError(503, 'Chưa cấu hình Cloudinary, hãy thêm CLOUDINARY_* vào .env');
  }

  const params = { allowed_formats: ALLOWED_FORMATS, folder, timestamp: Math.round(Date.now() / 1000) };
  const toSign = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  const signature = createHash('sha1')
    .update(toSign + apiSecret)
    .digest('hex');

  return { cloudName, apiKey, signature, ...params };
}
