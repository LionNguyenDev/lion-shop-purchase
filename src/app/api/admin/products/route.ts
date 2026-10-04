import { adminProductQuerySchema, productSchema } from '@/lib/validations';
import { paginate, parseBody, parseQuery, route } from '@/server/http';
import { Product } from '@/server/models/product';
import { findOrCreateCategory } from '@/server/services/categories';
import { searchFilter } from '@/server/services/products';
import { requireAdmin } from '@/server/session';
import { NextResponse } from 'next/server';

export const GET = route(async (req) => {
  await requireAdmin();
  const { q, category, visibility, page, limit } = parseQuery(req, adminProductQuerySchema);
  const filter: Record<string, unknown> = {};
  if (q) Object.assign(filter, searchFilter(q));
  if (category) filter.category = category;
  if (visibility !== 'all') filter.isVisible = visibility === 'visible';
  const [items, total] = await Promise.all([
    Product.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('category', 'name slug'),
    Product.countDocuments(filter),
  ]);
  return { items, ...paginate(total, page, limit) };
});

export const POST = route(async (req) => {
  await requireAdmin();
  const { categoryName, ...input } = await parseBody(req, productSchema);
  const category = await findOrCreateCategory(categoryName);
  const product = await Product.create({ ...input, category: category._id });
  return NextResponse.json(product, { status: 201 });
});
