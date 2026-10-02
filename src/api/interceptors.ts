import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

/** Error thrown by every failed API call, carrying the server's Vietnamese message. */
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number
  ) {
    super(message);
  }
}

export const requestInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  // Auth uses the Better Auth session cookie, so no Authorization header is needed
  return config;
};

export const successInterceptor = (response: AxiosResponse): AxiosResponse => {
  return response;
};

export const errorInterceptor = async (error: AxiosError<{ message?: string }>): Promise<never> => {
  const status = error.response?.status;
  const message =
    error.response?.data?.message ??
    (error.code === 'ERR_NETWORK' ? 'Không kết nối được máy chủ' : 'Đã có lỗi xảy ra, vui lòng thử lại');
  throw new ApiError(message, status);
};
