'use client';

import { useAdminOrder, useAdminOrders, useUpdateOrderStatus } from '@/api/admin';
import { OrderItems, OrderStatusBadge, formatOrderAddress } from '@/components/orders/order-items';
import { Button } from '@/components/ui/button';
import { ConfirmDialog, Dialog } from '@/components/ui/dialog';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatDateTime, formatNumber } from '@/lib/format';
import { NEXT_ORDER_STATUSES, ORDER_STATUS_META } from '@/lib/order-status';
import { cn } from '@/lib/utils';
import { ORDER_STATUSES, type OrderStatus } from '@/lib/validations';
import { ExternalLink } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { DataTable } from './data-table';
import { PageHeader } from './page-header';
import { SearchInput } from './search-input';

const ACTION_LABELS: Partial<Record<OrderStatus, string>> = {
  confirmed: 'Xác nhận đơn',
  shipping: 'Bắt đầu giao',
  completed: 'Đã giao xong',
  cancelled: 'Huỷ đơn',
};

export function AdminOrders() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('status') as OrderStatus | null;
  const [status, setStatus] = useState<OrderStatus | undefined>(
    initialStatus && ORDER_STATUSES.includes(initialStatus) ? initialStatus : undefined
  );
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data, isLoading } = useAdminOrders({ q: q || undefined, status, page, limit: 20 });

  const tabs: { value: OrderStatus | undefined; label: string }[] = [
    { value: undefined, label: 'Tất cả' },
    ...ORDER_STATUSES.map((value) => ({ value, label: ORDER_STATUS_META[value].label })),
  ];

  return (
    <div>
      <PageHeader
        title='Đơn hàng'
        description={data ? `${formatNumber(data.total)} đơn hàng` : undefined}
        action={
          <SearchInput
            placeholder='Tìm mã đơn, tên, SĐT'
            onSearch={(value) => {
              setQ(value);
              setPage(1);
            }}
          />
        }
      />
      <div className='mb-4 flex gap-2 overflow-x-auto pb-1' role='group' aria-label='Lọc theo trạng thái'>
        {tabs.map((tab) => (
          <button
            key={tab.label}
            type='button'
            aria-pressed={status === tab.value}
            onClick={() => {
              setStatus(tab.value);
              setPage(1);
            }}
            className={cn(
              'h-10 shrink-0 whitespace-nowrap rounded-full border px-4 font-semibold text-sm transition-colors duration-200',
              status === tab.value
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card hover:border-primary hover:text-primary'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <DataTable
        headers={[
          { label: 'Mã đơn' },
          { label: 'Khách hàng' },
          { label: 'Địa chỉ' },
          { label: 'Tổng tiền', className: 'text-right' },
          { label: 'Trạng thái' },
          { label: 'Ngày đặt' },
        ]}
        loading={isLoading}
        isEmpty={data?.items.length === 0}
        empty='Không có đơn hàng nào'
      >
        {data?.items.map((order) => (
          <tr key={order.id} className='cursor-pointer hover:bg-muted/40' onClick={() => setSelectedId(order.id)}>
            <td className='px-4 py-3'>
              <button
                type='button'
                className='font-bold font-heading text-primary hover:underline'
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedId(order.id);
                }}
              >
                #{order.code}
              </button>
            </td>
            <td className='px-4 py-3'>
              <p className='font-semibold'>{order.customer.name}</p>
              <p className='text-muted-foreground text-xs tabular-nums'>{order.customer.phone}</p>
            </td>
            <td className='max-w-xs px-4 py-3 text-muted-foreground'>
              <span className='line-clamp-2'>{formatOrderAddress(order)}</span>
            </td>
            <td className='px-4 py-3 text-right font-semibold tabular-nums'>{formatCurrency(order.total)}</td>
            <td className='px-4 py-3'>
              <OrderStatusBadge status={order.status} />
            </td>
            <td className='px-4 py-3 text-muted-foreground'>{formatDateTime(order.createdAt)}</td>
          </tr>
        ))}
      </DataTable>
      {data && (
        <div className='mt-6'>
          <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
        </div>
      )}
      <OrderDetailDialog orderId={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  );
}

function OrderDetailDialog({ orderId, onClose }: { orderId: string | null; onClose: () => void }) {
  const { data: order, isLoading } = useAdminOrder(orderId);
  const updateStatus = useUpdateOrderStatus();
  const [confirmCancel, setConfirmCancel] = useState(false);

  const changeStatus = async (status: OrderStatus) => {
    if (!order) return;
    try {
      await updateStatus.mutateAsync({ id: order.id, status });
      toast.success(`Đơn ${order.code}: ${ORDER_STATUS_META[status].label}`);
      setConfirmCancel(false);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <Dialog
      open={Boolean(orderId)}
      onOpenChange={(open) => !open && onClose()}
      title={order ? `Đơn hàng #${order.code}` : 'Đơn hàng'}
      description={order ? `Đặt lúc ${formatDateTime(order.createdAt)}` : undefined}
      className='max-w-2xl'
    >
      {isLoading || !order ? (
        <div className='space-y-3'>
          <Skeleton className='h-24 w-full' />
          <Skeleton className='h-40 w-full' />
        </div>
      ) : (
        <div className='space-y-5'>
          <div className='flex items-center gap-2'>
            <span className='text-muted-foreground text-sm'>Trạng thái:</span>
            <OrderStatusBadge status={order.status} />
          </div>
          <dl className='grid gap-3 rounded-xl bg-muted/60 p-4 text-sm sm:grid-cols-2'>
            <div>
              <dt className='text-muted-foreground text-xs'>Người nhận</dt>
              <dd className='font-semibold'>{order.customer.name}</dd>
            </div>
            <div>
              <dt className='text-muted-foreground text-xs'>Số điện thoại</dt>
              <dd className='font-semibold tabular-nums'>
                <a href={`tel:${order.customer.phone}`} className='hover:text-primary'>
                  {order.customer.phone}
                </a>
              </dd>
            </div>
            <div className='sm:col-span-2'>
              <dt className='text-muted-foreground text-xs'>Facebook</dt>
              <dd>
                <a
                  href={order.customer.facebookUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-1 break-all font-semibold text-primary hover:underline'
                >
                  {order.customer.facebookUrl}
                  <ExternalLink className='h-3.5 w-3.5 shrink-0' aria-hidden />
                </a>
              </dd>
            </div>
            <div className='sm:col-span-2'>
              <dt className='text-muted-foreground text-xs'>Địa chỉ giao hàng</dt>
              <dd className='font-semibold'>{formatOrderAddress(order)}</dd>
            </div>
            {order.note && (
              <div className='sm:col-span-2'>
                <dt className='text-muted-foreground text-xs'>Ghi chú</dt>
                <dd className='whitespace-pre-line'>{order.note}</dd>
              </div>
            )}
          </dl>
          <OrderItems order={order} />
          <div className='flex items-center justify-between border-border border-t pt-4'>
            <span className='font-semibold'>Tổng cộng (COD)</span>
            <span className='font-bold text-accent text-xl tabular-nums'>{formatCurrency(order.total)}</span>
          </div>
          {NEXT_ORDER_STATUSES[order.status].length > 0 && (
            <div className='flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'>
              {NEXT_ORDER_STATUSES[order.status].map((next) => (
                <Button
                  key={next}
                  variant={next === 'cancelled' ? 'outline' : 'primary'}
                  className={
                    next === 'cancelled' ? 'text-destructive hover:border-destructive hover:text-destructive' : ''
                  }
                  loading={updateStatus.isPending && updateStatus.variables?.status === next}
                  disabled={updateStatus.isPending}
                  onClick={() => (next === 'cancelled' ? setConfirmCancel(true) : changeStatus(next))}
                >
                  {ACTION_LABELS[next]}
                </Button>
              ))}
            </div>
          )}
          <ConfirmDialog
            open={confirmCancel}
            onOpenChange={setConfirmCancel}
            title='Huỷ đơn hàng?'
            description={`Đơn ${order.code} sẽ bị huỷ và số lượng sản phẩm được hoàn lại kho.`}
            confirmLabel='Huỷ đơn'
            destructive
            loading={updateStatus.isPending}
            onConfirm={() => changeStatus('cancelled')}
          />
        </div>
      )}
    </Dialog>
  );
}
