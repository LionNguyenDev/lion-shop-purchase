import { shopPasswordSchema } from '@/lib/validations';
import { parseBody, route } from '@/server/http';
import { requireAdmin } from '@/server/session';
import { getShopSettings, setShopPassword } from '@/server/shop-access';

export const GET = route(async () => {
  await requireAdmin();
  const settings = await getShopSettings();
  return {
    hasShopPassword: Boolean(settings?.shopPasswordHash),
    shopPasswordUpdatedAt: settings?.shopPasswordUpdatedAt ?? null,
  };
});

export const PUT = route(async (req) => {
  await requireAdmin();
  const { password } = await parseBody(req, shopPasswordSchema);
  await setShopPassword(password);
  return { success: true };
});
