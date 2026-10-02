import { shopAccessSchema } from '@/lib/validations';
import { HttpError, parseBody, route } from '@/server/http';
import { requireUser } from '@/server/session';
import { unlockShop } from '@/server/shop-access';

const MESSAGES = {
  not_configured: [503, 'Cửa hàng chưa mở, vui lòng liên hệ admin'],
  wrong_password: [400, 'Mật khẩu cửa hàng không đúng'],
  rate_limited: [429, 'Bạn đã nhập sai quá nhiều lần, vui lòng thử lại sau 15 phút'],
} as const;

export const POST = route(async (req) => {
  const user = await requireUser();
  const { password } = await parseBody(req, shopAccessSchema);
  const result = await unlockShop(user.id, password);
  if (!result.ok) {
    const [status, message] = MESSAGES[result.reason];
    throw new HttpError(status, message);
  }
  return { success: true };
});
