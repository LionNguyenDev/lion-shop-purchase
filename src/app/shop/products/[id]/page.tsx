import { ProductDetail } from '@/components/shop/product-detail';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Chi tiết sản phẩm' };

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductDetail id={id} />;
}
