import { checkoutSchema, listQuerySchema } from '@/lib/validations';
import { paginate, parseBody, parseQuery, route } from '@/server/http';
import { Order } from '@/server/models/order';
import { createOrder } from '@/server/services/orders';
import { requireShopUser } from '@/server/session';
import { NextResponse } from 'next/server';

export const GET = route(async (req) => {
  const user = await requireShopUser();
  const { page, limit } = parseQuery(req, listQuerySchema);
  const filter = { user: user.id };
  const [items, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Order.countDocuments(filter),
  ]);
  return { items, ...paginate(total, page, limit) };
});

export const POST = route(async (req) => {
  const user = await requireShopUser();
  const input = await parseBody(req, checkoutSchema);
  const order = await createOrder(user.id, input);
  return NextResponse.json(order, { status: 201 });
});
