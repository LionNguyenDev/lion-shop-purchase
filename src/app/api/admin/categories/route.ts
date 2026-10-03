import { escapeRegex, slugify } from '@/lib/text';
import { categorySchema, listQuerySchema } from '@/lib/validations';
import { conflict, paginate, parseBody, parseQuery, route } from '@/server/http';
import { Category } from '@/server/models/category';
import { Product } from '@/server/models/product';
import { requireAdmin } from '@/server/session';
import { NextResponse } from 'next/server';

export const GET = route(async (req) => {
  await requireAdmin();
  const { q, page, limit } = parseQuery(req, listQuerySchema);
  // Slugs are accent-free, so "ao" also finds "Áo"
  const slugQuery = q ? slugify(q) : '';
  const filter = q
    ? {
        $or: [
          { name: { $regex: escapeRegex(q), $options: 'i' } },
          ...(slugQuery ? [{ slug: { $regex: escapeRegex(slugQuery) } }] : []),
        ],
      }
    : {};
  const [categories, total] = await Promise.all([
    Category.find(filter)
      .sort({ name: 1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Category.countDocuments(filter),
  ]);
  // Count products only for the categories on this page
  const counts = await Product.aggregate<{ _id: unknown; count: number }>([
    { $match: { category: { $in: categories.map((category) => category._id) } } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
  ]);
  const countById = new Map(counts.map((row) => [String(row._id), row.count]));
  const items = categories.map((category) => ({
    ...category.toJSON(),
    productCount: countById.get(String(category._id)) ?? 0,
  }));
  return { items, ...paginate(total, page, limit) };
});

export const POST = route(async (req) => {
  await requireAdmin();
  const input = await parseBody(req, categorySchema);
  const slug = slugify(input.name);
  if (await Category.exists({ slug })) throw conflict('Danh mục này đã tồn tại');
  const category = await Category.create({ ...input, slug });
  return NextResponse.json(category, { status: 201 });
});
