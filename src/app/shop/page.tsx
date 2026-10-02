import { Catalog } from '@/components/shop/catalog';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = { title: 'Cửa hàng' };

export default function ShopPage() {
  return (
    <Suspense>
      <Catalog />
    </Suspense>
  );
}
