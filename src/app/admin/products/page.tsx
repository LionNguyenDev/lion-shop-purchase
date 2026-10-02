import { AdminProducts } from '@/components/admin/products';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Sản phẩm' };

export default function AdminProductsPage() {
  return <AdminProducts />;
}
