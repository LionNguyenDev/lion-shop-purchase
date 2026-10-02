import { notFound, route } from '@/server/http';
import { Order } from '@/server/models/order';
import { requireShopUser } from '@/server/session';
import { isValidObjectId } from 'mongoose';

export const GET = route<{ id: string }>(async (_req, { params }) => {
  const user = await requireShopUser();
  const { id } = await params;
  if (!isValidObjectId(id)) throw notFound('Không tìm thấy đơn hàng');
  const order = await Order.findOne({ _id: id, user: user.id });
  if (!order) throw notFound('Không tìm thấy đơn hàng');
  return order;
});
