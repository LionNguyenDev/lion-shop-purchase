'use client';

import { useProduct } from '@/api/shop';
import { Badge } from '@/components/ui/badge';
import { Button, buttonClasses } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { ProductImage } from '@/components/ui/product-image';
import { QuantityInput } from '@/components/ui/quantity-input';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatNumber } from '@/lib/format';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { ArrowLeft, PackageX, ShoppingCart, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAddToCartWithToast } from './use-add-to-cart';

export function ProductDetail({ id }: { id: string }) {
  const router = useRouter();
  const { data: product, isLoading, isError, error } = useProduct(id);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const { add, isPending } = useAddToCartWithToast();

  if (isLoading) {
    return (
      <div className='grid gap-8 md:grid-cols-2'>
        <Skeleton className='aspect-square w-full rounded-2xl' />
        <div className='space-y-4'>
          <Skeleton className='h-5 w-24' />
          <Skeleton className='h-9 w-3/4' />
          <Skeleton className='h-8 w-40' />
          <Skeleton className='h-32 w-full' />
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <EmptyState
        icon={PackageX}
        title='Không tìm thấy sản phẩm'
        description={(error as Error | null)?.message ?? 'Sản phẩm có thể đã ngừng bán.'}
        action={
          <Link href={ROUTES.SHOP} className={buttonClasses('primary')}>
            Về cửa hàng
          </Link>
        }
      />
    );
  }

  const outOfStock = product.stock <= 0;
  const buyNow = async () => {
    if (await add(product.id, quantity)) router.push(ROUTES.CART);
  };

  return (
    <div>
      <Link
        href={ROUTES.SHOP}
        className='mb-6 inline-flex min-h-11 items-center gap-2 font-semibold text-primary text-sm hover:underline'
      >
        <ArrowLeft className='h-4 w-4' aria-hidden />
        Quay lại cửa hàng
      </Link>
      <div className='grid gap-8 md:grid-cols-2 lg:gap-12'>
        <div className='space-y-3'>
          <div className='overflow-hidden rounded-2xl border border-border/70 bg-card'>
            <ProductImage
              src={product.images[activeImage]}
              alt={product.name}
              width={1000}
              className='aspect-square w-full'
            />
          </div>
          {product.images.length > 1 && (
            <div className='flex gap-2 overflow-x-auto pb-1'>
              {product.images.map((image, index) => (
                <button
                  key={image}
                  type='button'
                  onClick={() => setActiveImage(index)}
                  aria-label={`Xem ảnh ${index + 1}`}
                  aria-pressed={index === activeImage}
                  className={cn(
                    'h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-colors',
                    index === activeImage ? 'border-primary' : 'border-transparent hover:border-border'
                  )}
                >
                  <ProductImage src={image} alt='' width={160} className='h-full w-full' />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {product.category && (
            <p className='font-semibold text-primary text-sm uppercase tracking-wide'>{product.category.name}</p>
          )}
          <h1 className='mt-2 font-bold text-3xl leading-tight tracking-tight'>{product.name}</h1>
          <p className='mt-4 font-bold font-heading text-3xl text-accent tabular-nums'>
            {formatCurrency(product.price)}
          </p>
          <div className='mt-4 flex flex-wrap gap-2'>
            {outOfStock ? (
              <Badge tone='danger'>Hết hàng</Badge>
            ) : (
              <Badge tone='primary'>Còn {formatNumber(product.stock)} sản phẩm</Badge>
            )}
            <Badge>Đã bán {formatNumber(product.sold)}</Badge>
          </div>

          {!outOfStock && (
            <div className='mt-8 space-y-4'>
              <div className='flex items-center gap-4'>
                <span className='font-semibold text-sm'>Số lượng</span>
                <QuantityInput value={quantity} max={product.stock} onChange={setQuantity} />
              </div>
              <div className='flex flex-col gap-3 sm:flex-row'>
                <Button
                  variant='outline'
                  size='lg'
                  className='flex-1'
                  loading={isPending}
                  onClick={() => add(product.id, quantity)}
                >
                  <ShoppingCart className='h-5 w-5' aria-hidden />
                  Thêm vào giỏ
                </Button>
                <Button variant='accent' size='lg' className='flex-1' disabled={isPending} onClick={buyNow}>
                  <Zap className='h-5 w-5' aria-hidden />
                  Mua ngay
                </Button>
              </div>
            </div>
          )}

          <section className='mt-10 border-border border-t pt-6'>
            <h2 className='font-semibold text-lg'>Mô tả sản phẩm</h2>
            <p className='mt-3 whitespace-pre-line text-muted-foreground leading-relaxed'>
              {product.description || 'Chưa có mô tả cho sản phẩm này.'}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
