import { cartItemSchema } from '@/lib/validations';
import { badRequest, parseBody, route } from '@/server/http';
import { addToCart, getCartView, removeFromCart, setCartItemQuantity } from '@/server/services/cart';
import { requireShopUser } from '@/server/session';
import { isValidObjectId } from 'mongoose';

export const GET = route(async () => {
  const user = await requireShopUser();
  return getCartView(user.id);
});

/** Adds `quantity` on top of what is already in the cart. */
export const POST = route(async (req) => {
  const user = await requireShopUser();
  const { productId, quantity } = await parseBody(req, cartItemSchema);
  await addToCart(user.id, productId, quantity);
  return getCartView(user.id);
});

/** Sets the exact quantity of a cart line. */
export const PATCH = route(async (req) => {
  const user = await requireShopUser();
  const { productId, quantity } = await parseBody(req, cartItemSchema);
  await setCartItemQuantity(user.id, productId, quantity);
  return getCartView(user.id);
});

export const DELETE = route(async (req) => {
  const user = await requireShopUser();
  const productId = req.nextUrl.searchParams.get('productId');
  if (!productId || !isValidObjectId(productId)) throw badRequest('Thiếu sản phẩm cần xoá');
  await removeFromCart(user.id, productId);
  return getCartView(user.id);
});
