import { badRequest, notFound, route } from '@/server/http';
import { Order } from '@/server/models/order';
import { changeOrderStatus } from '@/server/services/orders';
import { requireShopUser } from '@/server/session';
import { isValidObjectId } from 'mongoose';

/** Users can cancel their own order while it is still pending. */
export const POST = route<{ id: string }>(async (_req, { params }) => {
  const user = await requireShopUser();
  const { id } = await params;
  if (!isValidObjectId(id)) throw notFound('Không tìm thấy đơn hàng');
  const order = await Order.findOne({ _id: id, user: user.id }, 'status');
  if (!order) throw notFound('Không tìm thấy đơn hàng');
  if (order.status !== 'pending') throw badRequest('Chỉ huỷ được đơn hàng đang chờ xác nhận');
  return changeOrderStatus(id, 'cancelled', user.id);
});
