import { route } from '@/server/http';
import { Category } from '@/server/models/category';
import { requireAdmin } from '@/server/session';

/** Every category (id, name, slug) for dropdowns; the main list endpoint is paginated */
export const GET = route(async () => {
  await requireAdmin();
  const categories = await Category.find({}, { name: 1, slug: 1 }).sort({ name: 1 });
  return categories.map((category) => ({ id: String(category._id), name: category.name, slug: category.slug }));
});
