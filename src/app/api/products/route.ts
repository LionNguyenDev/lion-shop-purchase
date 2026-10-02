import { productQuerySchema } from '@/lib/validations';
import { parseQuery, route } from '@/server/http';
import { listShopProducts } from '@/server/services/products';
import { requireShopUser } from '@/server/session';

export const GET = route(async (req) => {
  await requireShopUser();
  return listShopProducts(parseQuery(req, productQuerySchema));
});
