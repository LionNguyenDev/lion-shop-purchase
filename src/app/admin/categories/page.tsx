import { AdminCategories } from '@/components/admin/categories';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Danh mục' };

export default function AdminCategoriesPage() {
  return <AdminCategories />;
}
