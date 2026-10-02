import type { Order } from '@/api/types';
import { Badge } from '@/components/ui/badge';
import { ProductImage } from '@/components/ui/product-image';
import { formatCurrency } from '@/lib/format';
import { ORDER_STATUS_META } from '@/lib/order-status';

export function OrderStatusBadge({ status }: { status: Order['status'] }) {
  const meta = ORDER_STATUS_META[status];
  return <Badge tone={meta.tone}>{meta.label}</Badge>;
}

export function OrderItems({ order }: { order: Order }) {
  return (
    <ul className='divide-y divide-border'>
      {order.items.map((item) => (
        <li key={`${item.product}-${item.name}`} className='flex items-center gap-3 py-3'>
          <ProductImage src={item.image} alt={item.name} width={100} className='h-12 w-12 shrink-0 rounded-lg' />
          <div className='min-w-0 flex-1 text-sm'>
            <p className='line-clamp-1 font-medium'>{item.name}</p>
            <p className='text-muted-foreground tabular-nums'>
              {item.quantity} × {formatCurrency(item.price)}
            </p>
          </div>
          <p className='font-semibold text-sm tabular-nums'>{formatCurrency(item.price * item.quantity)}</p>
        </li>
      ))}
    </ul>
  );
}

export function formatOrderAddress(order: Order) {
  const { street, wardName, provinceName } = order.address;
  return `${street}, ${wardName}, ${provinceName}`;
}
