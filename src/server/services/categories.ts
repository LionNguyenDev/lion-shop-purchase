import { slugify } from '@/lib/text';
import { badRequest } from '../http';
import { Category } from '../models/category';

/** Category matching `name` by slug (so "son môi" reuses "Son Môi"), created when none exists yet. */
export async function findOrCreateCategory(name: string) {
  const slug = slugify(name);
  if (!slug) throw badRequest('Tên danh mục không hợp lệ');
  try {
    return await Category.findOneAndUpdate({ slug }, { $setOnInsert: { name, slug } }, { upsert: true, new: true });
  } catch (error) {
    // Two saves creating the same category at once: the unique slug index rejects one, which reuses the other
    if ((error as { code?: number }).code === 11000) return Category.findOne({ slug }).orFail();
    throw error;
  }
}
