import { slugify } from '@/lib/text';
import { categorySchema } from '@/lib/validations';
import { conflict, parseBody, route } from '@/server/http';
import { Category } from '@/server/models/category';
import { Product } from '@/server/models/product';
import { requireAdmin } from '@/server/session';
import { NextResponse } from 'next/server';

export const GET = route(async () => {
  await requireAdmin();
  const [categories, counts] = await Promise.all([
    Category.find().sort({ name: 1 }),
    Product.aggregate<{ _id: unknown; count: number }>([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
  ]);
  const countById = new Map(counts.map((row) => [String(row._id), row.count]));
  return categories.map((category) => ({
    ...category.toJSON(),
    productCount: countById.get(String(category._id)) ?? 0,
  }));
});

export const POST = route(async (req) => {
  await requireAdmin();
  const input = await parseBody(req, categorySchema);
  const slug = slugify(input.name);
  if (await Category.exists({ slug })) throw conflict('Danh mục này đã tồn tại');
  const category = await Category.create({ ...input, slug });
  return NextResponse.json(category, { status: 201 });
});
