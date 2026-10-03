import type { Me } from '@/api/types';
import { getCurrentUser } from './session';
import { hasShopAccess } from './shop-access';

/** Signed-in user and shop access, shared by `/api/me` and server-rendered pages */
export async function getMe(): Promise<Me> {
  const user = await getCurrentUser();
  if (!user) return { user: null, hasShopAccess: false };
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image ?? null,
      phone: user.phone ?? '',
      facebookUrl: user.facebookUrl ?? '',
      role: user.role === 'admin' ? 'admin' : 'user',
    },
    hasShopAccess: await hasShopAccess(user),
  };
}
