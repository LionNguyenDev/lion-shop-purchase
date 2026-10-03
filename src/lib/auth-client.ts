import type { auth } from '@/server/auth';
import { emailOTPClient, inferAdditionalFields } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>(), emailOTPClient()],
});

const AUTH_ERRORS: Record<string, string> = {
  USER_ALREADY_EXISTS: 'Email này đã được đăng ký',
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: 'Email này đã được đăng ký',
  PHONE_ALREADY_EXISTS: 'Số điện thoại này đã được đăng ký',
  INVALID_EMAIL_OR_PASSWORD: 'Email hoặc mật khẩu không đúng',
  INVALID_OTP: 'Mã OTP không đúng',
  OTP_EXPIRED: 'Mã OTP đã hết hạn, vui lòng gửi lại mã mới',
  TOO_MANY_ATTEMPTS: 'Bạn đã nhập sai quá nhiều lần, vui lòng gửi lại mã mới',
  PASSWORD_TOO_SHORT: 'Mật khẩu quá ngắn',
};

/** Maps Better Auth error codes to Vietnamese messages. */
export function authErrorMessage(error: { code?: string; message?: string; status?: number } | null | undefined) {
  if (!error) return 'Đã có lỗi xảy ra, vui lòng thử lại';
  if (error.status === 429) return 'Bạn thao tác quá nhanh, vui lòng thử lại sau ít phút';
  return (error.code && AUTH_ERRORS[error.code]) || error.message || 'Đã có lỗi xảy ra, vui lòng thử lại';
}
