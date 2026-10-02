import { route } from '@/server/http';
import { Order } from '@/server/models/order';
import { Product } from '@/server/models/product';
import { User } from '@/server/models/user';
import { requireAdmin } from '@/server/session';

export const GET = route(async () => {
  await requireAdmin();
  const [users, products, hiddenProducts, outOfStock, ordersByStatus, revenue] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Product.countDocuments({ isVisible: false }),
    Product.countDocuments({ stock: 0 }),
    Order.aggregate<{ _id: string; count: number }>([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Order.aggregate<{ total: number }>([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
  ]);
  return {
    users,
    products,
    hiddenProducts,
    outOfStock,
    orders: Object.fromEntries(ordersByStatus.map((row) => [row._id, row.count])),
    revenue: revenue[0]?.total ?? 0,
  };
});
