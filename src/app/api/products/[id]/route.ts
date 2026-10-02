import { notFound, route } from '@/server/http';
import { Product } from '@/server/models/product';
import { requireShopUser } from '@/server/session';
import { isValidObjectId } from 'mongoose';

export const GET = route<{ id: string }>(async (_req, { params }) => {
  await requireShopUser();
  const { id } = await params;
  if (!isValidObjectId(id)) throw notFound('Không tìm thấy sản phẩm');
  const product = await Product.findOne({ _id: id, isVisible: true }).populate('category', 'name slug');
  if (!product) throw notFound('Không tìm thấy sản phẩm');
  return product;
});
