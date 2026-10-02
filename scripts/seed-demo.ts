/**
 * Inserts a few demo categories and products into an empty catalog.
 * Usage: pnpm seed:demo
 */
import { slugify } from '@/lib/text';
import { connectDB } from '@/server/db/mongoose';
import { Category } from '@/server/models/category';
import { Product } from '@/server/models/product';
import mongoose from 'mongoose';

const DEMO = [
  {
    category: 'Thời trang',
    products: [
      {
        name: 'Áo thun cotton basic',
        price: 159000,
        stock: 50,
        description: 'Chất cotton 100%, thoáng mát, form unisex.',
      },
      { name: 'Quần jean ống suông', price: 399000, stock: 20, description: 'Vải jean co giãn nhẹ, màu xanh nhạt.' },
      { name: 'Áo khoác gió 2 lớp', price: 459000, stock: 0, description: 'Chống nước nhẹ, có mũ tháo rời.' },
    ],
  },
  {
    category: 'Phụ kiện',
    products: [
      { name: 'Mũ lưỡi trai thêu chữ', price: 129000, stock: 35, description: 'Vải kaki, khoá điều chỉnh phía sau.' },
      { name: 'Túi tote canvas', price: 99000, stock: 80, description: 'Canvas dày, in hình đơn giản.' },
    ],
  },
  {
    category: 'Đồ gia dụng',
    products: [
      { name: 'Bình giữ nhiệt 500ml', price: 249000, stock: 15, description: 'Giữ nóng 12 giờ, giữ lạnh 24 giờ.' },
      { name: 'Hộp cơm thuỷ tinh 3 ngăn', price: 189000, stock: 25, description: 'Dùng được trong lò vi sóng.' },
    ],
  },
];

async function main() {
  await connectDB();
  if ((await Product.estimatedDocumentCount()) > 0) {
    console.info('Catalog is not empty, skipping demo data');
    return;
  }
  for (const group of DEMO) {
    const category = await Category.findOneAndUpdate(
      { slug: slugify(group.category) },
      { $setOnInsert: { name: group.category, slug: slugify(group.category) } },
      { upsert: true, returnDocument: 'after' }
    );
    // create() instead of insertMany() so the save hook fills searchText
    for (const product of group.products) await Product.create({ ...product, category: category._id });
  }
  console.info('Demo catalog created');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect().then(() => process.exit()));
