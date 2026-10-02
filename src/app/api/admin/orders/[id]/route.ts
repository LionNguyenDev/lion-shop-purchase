import { orderStatusSchema } from '@/lib/validations';
import { notFound, parseBody, route } from '@/server/http';
import { Order } from '@/server/models/order';
import { changeOrderStatus } from '@/server/services/orders';
import { requireAdmin } from '@/server/session';
import { isValidObjectId } from 'mongoose';

export const GET = route<{ id: string }>(async (_req, { params }) => {
  await requireAdmin();
  const { id } = await params;
  const order = isValidObjectId(id) ? await Order.findById(id) : null;
  if (!order) throw notFound('Không tìm thấy đơn hàng');
  return order;
});

export const PATCH = route<{ id: string }>(async (req, { params }) => {
  await requireAdmin();
  const { id } = await params;
  if (!isValidObjectId(id)) throw notFound('Không tìm thấy đơn hàng');
  const { status } = await parseBody(req, orderStatusSchema);
  return changeOrderStatus(id, status);
});
