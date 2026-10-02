'use client';

import { useCart, useRemoveCartItem, useUpdateCartItem } from '@/api/shop';
import { Button, buttonClasses } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ProductImage } from '@/components/ui/product-image';
import { QuantityInput } from '@/components/ui/quantity-input';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/format';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { AlertTriangle, ShoppingCart, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export function CartView() {
  const { data: cart, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  const run = (promise: Promise<unknown>) => promise.catch((error: Error) => toast.error(error.message));

  if (isLoading) {
    return (
      <div className='space-y-3'>
        <Skeleton className='h-9 w-48' />
        <Skeleton className='h-28 w-full' />
        <Skeleton className='h-28 w-full' />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title='Giỏ hàng đang trống'
        description='Hãy chọn vài sản phẩm bạn thích nhé.'
        action={
          <Link href={ROUTES.SHOP} className={buttonClasses('primary')}>
            Tiếp tục mua sắm
          </Link>
        }
      />
    );
  }

  const hasUnavailable = cart.items.some((item) => !item.isAvailable);

  return (
    <div>
      <h1 className='font-bold text-3xl tracking-tight'>Giỏ hàng</h1>
      <div className='mt-6 grid gap-6 lg:grid-cols-[1fr_340px]'>
        <ul className='space-y-3'>
          {cart.items.map(({ product, quantity, isAvailable }) => (
            <li key={product.id}>
              <Card className={cn('flex gap-4 p-4', !isAvailable && 'border-destructive/50')}>
                <Link
                  href={`/shop/products/${product.id}`}
                  className='shrink-0 overflow-hidden rounded-xl'
                  tabIndex={-1}
                  aria-hidden
                >
                  <ProductImage
                    src={product.image}
                    alt={product.name}
                    width={200}
                    className='h-20 w-20 sm:h-24 sm:w-24'
                  />
                </Link>
                <div className='flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                  <div className='min-w-0'>
                    <Link
                      href={`/shop/products/${product.id}`}
                      className='line-clamp-2 font-semibold hover:text-primary'
                    >
                      {product.name}
                    </Link>
                    <p className='mt-1 font-bold text-accent tabular-nums'>{formatCurrency(product.price)}</p>
                    {!isAvailable && (
                      <p className='mt-1 flex items-center gap-1 font-medium text-destructive text-xs'>
                        <AlertTriangle className='h-3.5 w-3.5' aria-hidden />
                        {product.stock > 0 ? `Chỉ còn ${product.stock} sản phẩm` : 'Đã hết hàng'}
                      </p>
                    )}
                  </div>
                  <div className='flex items-center gap-2'>
                    <QuantityInput
                      value={quantity}
                      max={Math.max(product.stock, 1)}
                      disabled={updateItem.isPending || product.stock <= 0}
                      onChange={(next) => run(updateItem.mutateAsync({ productId: product.id, quantity: next }))}
                      label={`Số lượng ${product.name}`}
                    />
                    <Button
                      variant='ghost'
                      size='icon'
                      className='text-muted-foreground hover:bg-destructive-soft hover:text-destructive'
                      onClick={() => run(removeItem.mutateAsync(product.id))}
                      aria-label={`Xoá ${product.name} khỏi giỏ`}
                    >
                      <Trash2 className='h-5 w-5' aria-hidden />
                    </Button>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>

        <Card className='h-fit p-5 lg:sticky lg:top-24'>
          <h2 className='font-semibold text-lg'>Tóm tắt đơn hàng</h2>
          <dl className='mt-4 space-y-2 text-sm'>
            <div className='flex justify-between'>
              <dt className='text-muted-foreground'>Số sản phẩm</dt>
              <dd className='font-semibold tabular-nums'>{cart.count}</dd>
            </div>
            <div className='flex justify-between border-border border-t pt-3 text-base'>
              <dt className='font-semibold'>Tạm tính</dt>
              <dd className='font-bold text-accent text-xl tabular-nums'>{formatCurrency(cart.subtotal)}</dd>
            </div>
          </dl>
          {hasUnavailable && (
            <p className='mt-4 rounded-xl bg-destructive-soft px-3 py-2 font-medium text-destructive text-xs'>
              Một số sản phẩm không đủ hàng. Vui lòng giảm số lượng hoặc xoá trước khi đặt hàng.
            </p>
          )}
          {hasUnavailable ? (
            <Button variant='accent' size='lg' className='mt-5 w-full' disabled>
              Tiến hành đặt hàng
            </Button>
          ) : (
            <Link href={ROUTES.CHECKOUT} className={cn(buttonClasses('accent', 'lg'), 'mt-5 w-full')}>
              Tiến hành đặt hàng
            </Link>
          )}
          <Link href={ROUTES.SHOP} className={cn(buttonClasses('ghost'), 'mt-2 w-full')}>
            Tiếp tục mua sắm
          </Link>
        </Card>
      </div>
    </div>
  );
}
