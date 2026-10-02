import { slugify } from '@/lib/text';
import { categorySchema } from '@/lib/validations';
import { conflict, notFound, parseBody, route } from '@/server/http';
import { Category } from '@/server/models/category';
import { Product } from '@/server/models/product';
import { requireAdmin } from '@/server/session';
import { isValidObjectId } from 'mongoose';

async function findCategory(params: Promise<{ id: string }>) {
  const { id } = await params;
  const category = isValidObjectId(id) ? await Category.findById(id) : null;
  if (!category) throw notFound('Không tìm thấy danh mục');
  return category;
}

export const PATCH = route<{ id: string }>(async (req, { params }) => {
  await requireAdmin();
  const category = await findCategory(params);
  const input = await parseBody(req, categorySchema);
  const slug = slugify(input.name);
  if (await Category.exists({ slug, _id: { $ne: category._id } })) throw conflict('Danh mục này đã tồn tại');
  category.set({ ...input, slug });
  return category.save();
});

export const DELETE = route<{ id: string }>(async (_req, { params }) => {
  await requireAdmin();
  const category = await findCategory(params);
  if (await Product.exists({ category: category._id })) {
    throw conflict('Danh mục còn sản phẩm, hãy chuyển hoặc xoá sản phẩm trước');
  }
  await category.deleteOne();
  return { success: true };
});
