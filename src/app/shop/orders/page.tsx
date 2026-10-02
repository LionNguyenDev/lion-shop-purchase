import { MyOrders } from '@/components/shop/my-orders';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Đơn hàng của tôi' };

export default function MyOrdersPage() {
  return <MyOrders />;
}
