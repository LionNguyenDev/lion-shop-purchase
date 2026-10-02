import { escapeRegex } from '@/lib/text';
import { adminOrderQuerySchema } from '@/lib/validations';
import { paginate, parseQuery, route } from '@/server/http';
import { Order } from '@/server/models/order';
import { requireAdmin } from '@/server/session';

export const GET = route(async (req) => {
  await requireAdmin();
  const { q, status, page, limit } = parseQuery(req, adminOrderQuerySchema);
  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (q) {
    const regex = { $regex: escapeRegex(q), $options: 'i' };
    filter.$or = [{ code: regex }, { 'customer.name': regex }, { 'customer.phone': regex }];
  }
  const [items, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Order.countDocuments(filter),
  ]);
  return { items, ...paginate(total, page, limit) };
});
