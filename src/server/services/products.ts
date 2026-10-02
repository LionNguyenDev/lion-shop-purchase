import { escapeRegex, normalizeText } from '@/lib/text';
import type { ProductSort, productQuerySchema } from '@/lib/validations';
import { Types } from 'mongoose';
import type { z } from 'zod';
import { paginate } from '../http';
import { Product } from '../models/product';

const SORTS: Record<ProductSort, Record<string, 1 | -1>> = {
  newest: { createdAt: -1, _id: -1 },
  price_asc: { price: 1, _id: 1 },
  price_desc: { price: -1, _id: -1 },
  best_selling: { sold: -1, _id: -1 },
};

export const searchFilter = (q: string) => ({ searchText: { $regex: escapeRegex(normalizeText(q)) } });

export async function listShopProducts(query: z.output<typeof productQuerySchema>) {
  const { q, category, minPrice, maxPrice, inStock, sort, page, limit } = query;
  const baseFilter: Record<string, unknown> = { isVisible: true };
  if (q) Object.assign(baseFilter, searchFilter(q));
  if (category) baseFilter.category = new Types.ObjectId(category);
  if (inStock) baseFilter.stock = { $gt: 0 };

  const filter: Record<string, unknown> = { ...baseFilter };
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {
      ...(minPrice !== undefined && { $gte: minPrice }),
      ...(maxPrice !== undefined && { $lte: maxPrice }),
    };
  }

  const [items, total, bounds] = await Promise.all([
    Product.find(filter)
      .sort(SORTS[sort])
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('category', 'name slug'),
    Product.countDocuments(filter),
    // Price range of everything matching the other filters, used as the slider limits
    Product.aggregate<{ min: number; max: number }>([
      { $match: baseFilter },
      { $group: { _id: null, min: { $min: '$price' }, max: { $max: '$price' } } },
    ]),
  ]);
  return {
    items,
    priceBounds: { min: bounds[0]?.min ?? 0, max: bounds[0]?.max ?? 0 },
    ...paginate(total, page, limit),
  };
}
