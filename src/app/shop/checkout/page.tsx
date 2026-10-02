import { CheckoutForm } from '@/components/shop/checkout-form';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Đặt hàng' };

export default function CheckoutPage() {
  return <CheckoutForm />;
}
