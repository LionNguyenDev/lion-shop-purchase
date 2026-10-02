import { route } from '@/server/http';
import { Category } from '@/server/models/category';
import { Product } from '@/server/models/product';
import { requireShopUser } from '@/server/session';

/** Categories with the number of products customers can see in each. */
export const GET = route(async () => {
  await requireShopUser();
  const [categories, counts] = await Promise.all([
    Category.find().sort({ name: 1 }),
    Product.aggregate<{ _id: unknown; count: number }>([
      { $match: { isVisible: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]),
  ]);
  const countById = new Map(counts.map((row) => [String(row._id), row.count]));
  return categories.map((category) => ({
    ...category.toJSON(),
    productCount: countById.get(String(category._id)) ?? 0,
  }));
});
