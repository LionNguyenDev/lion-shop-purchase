import { headers } from 'next/headers';
import { cache } from 'react';
import { auth } from './auth';
import { forbidden, unauthorized } from './http';
import { hasShopAccess } from './shop-access';

export type CurrentUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

/**
 * Deduplicated per server render, so a layout and the header can both ask without a second DB lookup.
 * Without a session cookie Better Auth returns null without touching the database.
 */
export const getCurrentUser = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
});

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
