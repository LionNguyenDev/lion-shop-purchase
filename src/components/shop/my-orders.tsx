'use client';

import { useCancelMyOrder, useMyOrders } from '@/api/shop';
import type { Order } from '@/api/types';
import { OrderItems, OrderStatusBadge, formatOrderAddress } from '@/components/orders/order-items';
import { Button, buttonClasses } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatDateTime } from '@/lib/format';
import { ROUTES } from '@/lib/routes';
import { MapPin, Package } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

export function MyOrders() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMyOrders(page);
  const cancelOrder = useCancelMyOrder();
  const [cancelling, setCancelling] = useState<Order | null>(null);

  const confirmCancel = async () => {
    if (!cancelling) return;
    try {
      await cancelOrder.mutateAsync(cancelling.id);
      toast.success(`Đã huỷ đơn ${cancelling.code}`);
      setCancelling(null);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div>
      <h1 className='font-bold text-3xl tracking-tight'>Đơn hàng của tôi</h1>
      <div className='mt-6 space-y-4'>
        {isLoading ? (
          Array.from({ length: 3 }, (_, index) => <Skeleton key={index} className='h-40 w-full' />)
        ) : !data || data.items.length === 0 ? (
          <EmptyState
            icon={Package}
            title='Bạn chưa có đơn hàng nào'
            action={
              <Link href={ROUTES.SHOP} className={buttonClasses('primary')}>
                Mua sắm ngay
              </Link>
            }
          />
        ) : (
          data.items.map((order) => (
            <Card key={order.id} className='p-5'>
              <div className='flex flex-wrap items-center justify-between gap-2'>
                <div>
                  <p className='font-bold font-heading'>#{order.code}</p>
                  <p className='text-muted-foreground text-xs'>{formatDateTime(order.createdAt)}</p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>
              <OrderItems order={order} />
              <div className='flex flex-col gap-3 border-border border-t pt-3 sm:flex-row sm:items-center sm:justify-between'>
                <p className='flex items-start gap-1.5 text-muted-foreground text-sm'>
                  <MapPin className='mt-0.5 h-4 w-4 shrink-0' aria-hidden />
                  {formatOrderAddress(order)}
                </p>
                <div className='flex items-center justify-between gap-4'>
                  <p className='font-bold text-accent text-lg tabular-nums'>{formatCurrency(order.total)}</p>
                  {order.status === 'pending' && (
                    <Button variant='outline' size='sm' onClick={() => setCancelling(order)}>
                      Huỷ đơn
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
      {data && (
        <div className='mt-8'>
          <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
        </div>
      )}
      <ConfirmDialog
        open={Boolean(cancelling)}
        onOpenChange={(open) => !open && setCancelling(null)}
        title='Huỷ đơn hàng?'
        description={`Đơn ${cancelling?.code ?? ''} sẽ bị huỷ và không thể khôi phục.`}
        confirmLabel='Huỷ đơn'
        destructive
        loading={cancelOrder.isPending}
        onConfirm={confirmCancel}
      />
    </div>
  );
}
