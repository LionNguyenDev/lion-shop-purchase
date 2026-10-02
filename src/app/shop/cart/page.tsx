import { CartView } from '@/components/shop/cart-view';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Giỏ hàng' };

export default function CartPage() {
  return <CartView />;
}
