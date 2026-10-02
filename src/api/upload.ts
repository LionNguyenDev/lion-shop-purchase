import axios from 'axios';
import { client } from './client';
import { ApiError } from './interceptors';

interface UploadSignature {
  cloudName: string;
  apiKey: string;
  signature: string;
  timestamp: number;
  folder: string;
  allowed_formats: string;
}

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

/** Uploads straight to Cloudinary with a server-issued signature and returns the image URL. */
export async function uploadImage(file: File, onProgress?: (percent: number) => void) {
  if (!file.type.startsWith('image/')) throw new ApiError(`"${file.name}" không phải file ảnh`);
  if (file.size > MAX_IMAGE_SIZE) throw new ApiError(`"${file.name}" lớn hơn 5MB`);

  const { data: sign } = await client.post<UploadSignature>('/admin/uploads/signature');
  const form = new FormData();
  form.append('file', file);
  form.append('api_key', sign.apiKey);
  form.append('timestamp', String(sign.timestamp));
  form.append('signature', sign.signature);
  form.append('folder', sign.folder);
  form.append('allowed_formats', sign.allowed_formats);

  try {
    const { data } = await axios.post<{ secure_url: string }>(
      `https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`,
      form,
      {
        onUploadProgress: (event) => {
          if (event.total) onProgress?.(Math.round((event.loaded / event.total) * 100));
        },
      }
    );
    return data.secure_url;
  } catch (error) {
    const message = axios.isAxiosError<{ error?: { message?: string } }>(error)
      ? error.response?.data?.error?.message
      : undefined;
    if (message && /missing permissions/i.test(message)) {
      throw new ApiError('API key Cloudinary không có quyền upload ảnh. Hãy dùng key có quyền tạo ảnh (xem README)');
    }
    if (message && /signature|api_key|api key/i.test(message)) {
      throw new ApiError('Cloudinary từ chối: kiểm tra lại CLOUDINARY_API_KEY và CLOUDINARY_API_SECRET trong .env');
    }
    throw new ApiError(message ? `Upload thất bại: ${message}` : `Không upload được "${file.name}"`);
  }
}
