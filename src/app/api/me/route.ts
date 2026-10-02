import { route } from '@/server/http';
import { getCurrentUser } from '@/server/session';
import { hasShopAccess } from '@/server/shop-access';

export const GET = route(async () => {
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
      role: user.role ?? 'user',
    },
    hasShopAccess: await hasShopAccess(user),
  };
});
