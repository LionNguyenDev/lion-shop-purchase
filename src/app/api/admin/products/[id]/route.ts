import { productSchema } from '@/lib/validations';
import { badRequest, notFound, parseBody, route } from '@/server/http';
import { Cart } from '@/server/models/cart';
import { Category } from '@/server/models/category';
import { Product } from '@/server/models/product';
import { requireAdmin } from '@/server/session';
import { isValidObjectId } from 'mongoose';

async function findProduct(params: Promise<{ id: string }>) {
  const { id } = await params;
  const product = isValidObjectId(id) ? await Product.findById(id) : null;
  if (!product) throw notFound('Không tìm thấy sản phẩm');
  return product;
}

export const GET = route<{ id: string }>(async (_req, { params }) => {
  await requireAdmin();
  return findProduct(params);
});

/** Partial update, e.g. `{ isVisible: false }` to hide a product. */
export const PATCH = route<{ id: string }>(async (req, { params }) => {
  await requireAdmin();
  const product = await findProduct(params);
  const input = await parseBody(req, productSchema.partial());
  if (input.category && !(await Category.exists({ _id: input.category }))) throw badRequest('Danh mục không tồn tại');
  product.set(input);
  await product.save();
  return product.populate('category', 'name slug');
});

export const DELETE = route<{ id: string }>(async (_req, { params }) => {
  await requireAdmin();
  const product = await findProduct(params);
  // Orders keep their own copy of name and price, so only carts need cleaning
  await Promise.all([product.deleteOne(), Cart.updateMany({}, { $pull: { items: { product: product._id } } })]);
  return { success: true };
});
