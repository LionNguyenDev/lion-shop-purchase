import { headers } from 'next/headers';
import { auth } from './auth';
import { forbidden, unauthorized } from './http';
import { hasShopAccess } from './shop-access';

export type CurrentUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

export async function getCurrentUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}

export const isAdmin = (user: { role?: string | null }) => user.role === 'admin';

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw unauthorized();
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (!isAdmin(user)) throw forbidden();
  return user;
}

/** Logged-in user who has entered the shop password (admins always pass). */
export async function requireShopUser() {
  const user = await requireUser();
  if (!(await hasShopAccess(user))) throw forbidden('Bạn cần nhập mật khẩu cửa hàng để tiếp tục');
  return user;
}
