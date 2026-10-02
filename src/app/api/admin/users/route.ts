import { escapeRegex } from '@/lib/text';
import { listQuerySchema } from '@/lib/validations';
import { paginate, parseQuery, route } from '@/server/http';
import { User } from '@/server/models/user';
import { requireAdmin } from '@/server/session';
import { getShopSettings, hasShopAccess } from '@/server/shop-access';

export const GET = route(async (req) => {
  await requireAdmin();
  const { q, page, limit } = parseQuery(req, listQuerySchema);
  const filter = q
    ? { $or: ['name', 'email', 'phone'].map((field) => ({ [field]: { $regex: escapeRegex(q), $options: 'i' } })) }
    : {};
  const [users, total, settings] = await Promise.all([
    User.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    User.countDocuments(filter),
    getShopSettings(),
  ]);
  const items = await Promise.all(
    users.map(async (user) => ({ ...user.toJSON(), hasShopAccess: await hasShopAccess(user, settings) }))
  );
  return { items, ...paginate(total, page, limit) };
});
