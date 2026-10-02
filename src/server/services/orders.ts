import { NEXT_ORDER_STATUSES } from '@/lib/order-status';
import type { OrderStatus, checkoutSchema } from '@/lib/validations';
import { randomBytes } from 'node:crypto';
import type { z } from 'zod';
import { resolveAddress } from '../address';
import { badRequest, conflict, notFound } from '../http';
import { Order } from '../models/order';
import { Product } from '../models/product';
import { clearCart, loadCart } from './cart';

function generateOrderCode() {
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  return `LS${date}${randomBytes(3).toString('hex').toUpperCase()}`;
}

async function releaseStock(items: { product: unknown; quantity: number }[]) {
  await Promise.all(
    items.map(({ product, quantity }) =>
      Product.updateOne(
        { _id: product },
        [{ $set: { stock: { $add: ['$stock', quantity] }, sold: { $max: [0, { $subtract: ['$sold', quantity] }] } } }],
        { updatePipeline: true }
      )
    )
  );
}

export async function createOrder(userId: string, input: z.output<typeof checkoutSchema>) {
  const cart = await loadCart(userId);
  const cartItems = cart?.items ?? [];
  if (cartItems.length === 0) throw badRequest('Giỏ hàng đang trống');

  const unavailable = cartItems.filter((item) => !item.product?.isVisible);
  if (unavailable.length > 0) throw conflict('Giỏ hàng có sản phẩm đã ngừng bán, vui lòng kiểm tra lại giỏ hàng');

  const { province, ward } = await resolveAddress(input.provinceCode, input.wardCode);

  const items = cartItems.map(({ product, quantity }) => ({
    product: product!._id,
    name: product!.name,
    image: product!.images[0] ?? '',
    price: product!.price,
    quantity,
  }));

  // Reserve stock item by item with a conditional update; undo on any failure
  const reserved: typeof items = [];
  try {
    for (const item of items) {
      const result = await Product.updateOne(
        { _id: item.product, isVisible: true, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity, sold: item.quantity } }
      );
      if (result.modifiedCount === 0) throw conflict(`"${item.name}" không còn đủ hàng`);
      reserved.push(item);
    }

    const order = await Order.create({
      code: generateOrderCode(),
      user: userId,
      customer: { name: input.name, phone: input.phone, facebookUrl: input.facebookUrl },
      address: {
        provinceCode: province.code,
        provinceName: province.name,
        wardCode: ward.code,
        wardName: ward.name,
        street: input.street,
      },
      note: input.note,
      items,
      total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    });
    await clearCart(userId);
    return order;
  } catch (error) {
    await releaseStock(reserved);
    throw error;
  }
}

/** Moves an order to the next status. `userId` limits the change to that user's orders. */
export async function changeOrderStatus(orderId: string, status: OrderStatus, userId?: string) {
  const order = await Order.findOne({ _id: orderId, ...(userId && { user: userId }) });
  if (!order) throw notFound('Không tìm thấy đơn hàng');

  const from = order.status as OrderStatus;
  if (!NEXT_ORDER_STATUSES[from].includes(status)) throw badRequest('Không thể chuyển sang trạng thái này');

  // Guard on the previous status so two concurrent updates cannot both apply
  const updated = await Order.findOneAndUpdate(
    { _id: order._id, status: from },
    { $set: { status } },
    { returnDocument: 'after' }
  );
  if (!updated) throw conflict('Đơn hàng vừa được cập nhật, vui lòng tải lại');

  if (status === 'cancelled') await releaseStock(order.items);
  return updated;
}
