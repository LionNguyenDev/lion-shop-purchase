'use client';

import type { Product } from '@/api/types';
import { Button } from '@/components/ui/button';
import { ProductImage } from '@/components/ui/product-image';
import { shimmerClasses } from '@/components/ui/skeleton';
import { formatCurrency, formatNumber } from '@/lib/format';
import { cn } from '@/lib/utils';
import { Check, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { type CSSProperties, useEffect, useState } from 'react';

const NEW_FOR_MS = 14 * 24 * 60 * 60 * 1000;
const LOW_STOCK = 5;

interface ProductCardProps {
  product: Product;
  onAdd: (id: string) => Promise<boolean>;
  adding: boolean;
  /** Position in the grid, used to stagger the entrance animation. */
  index?: number;
}

export function ProductCard({ product, onAdd, adding, index = 0 }: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const outOfStock = product.stock <= 0;
  const lowStock = !outOfStock && product.stock <= LOW_STOCK;
  const isNew = Date.now() - new Date(product.createdAt).getTime() < NEW_FOR_MS;
  const soldRatio = product.sold / Math.max(product.sold + product.stock, 1);
  const href = `/shop/products/${product.id}`;

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 1600);
    return () => clearTimeout(timer);
  }, [added]);

  const handleAdd = async () => {
    if (await onAdd(product.id)) setAdded(true);
  };

  return (
    <article
      style={{ animationDelay: `${Math.min(index, 11) * 45}ms` } as CSSProperties}
      className='group hover:-translate-y-1 flex animate-fade-up flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-card transition-[transform,box-shadow] duration-300 ease-out hover:shadow-lift'
    >
      <Link href={href} className='relative block aspect-square overflow-hidden' tabIndex={-1} aria-hidden>
        <ProductImage
          src={product.images[0]}
          alt={product.name}
          width={500}
          className={cn(
            'h-full w-full transition-transform duration-500 ease-out group-hover:scale-105',
            outOfStock && 'grayscale-[60%]'
          )}
        />
        <div className='absolute top-3 left-3 flex flex-col items-start gap-1.5'>
          {isNew && !outOfStock && (
            <span className='rounded-full bg-accent px-2.5 py-0.5 font-bold text-[11px] text-white uppercase tracking-wide shadow-sm'>
              Mới
            </span>
          )}
          {lowStock && (
            <span className='rounded-full bg-white/95 px-2.5 py-0.5 font-bold text-[11px] text-destructive shadow-sm'>
              Chỉ còn {product.stock}
            </span>
          )}
        </div>
        {outOfStock && (
          <div className='absolute inset-0 flex items-center justify-center bg-foreground/35'>
            <span className='rounded-full bg-white px-4 py-1.5 font-bold text-foreground text-sm shadow'>Hết hàng</span>
          </div>
        )}
      </Link>

      <div className='flex flex-1 flex-col p-4'>
        {product.category && (
          <p className='truncate font-semibold text-[11px] text-primary uppercase tracking-wider'>
            {product.category.name}
          </p>
        )}
        <h3 className='mt-1 line-clamp-2 min-h-[2.75rem] font-semibold leading-snug'>
          <Link href={href} className='rounded transition-colors hover:text-primary'>
            {product.name}
          </Link>
        </h3>
        <p className='mt-2 font-bold font-heading text-accent text-xl tabular-nums'>{formatCurrency(product.price)}</p>

        <div className='mt-2'>
          <div className='flex justify-between text-muted-foreground text-xs'>
            <span>Đã bán {formatNumber(product.sold)}</span>
            {!outOfStock && <span>Còn {formatNumber(product.stock)}</span>}
          </div>
          <div className='mt-1 h-1 overflow-hidden rounded-full bg-muted' aria-hidden>
            <div
              className='h-full origin-left rounded-full bg-gradient-to-r from-primary to-accent transition-transform duration-700 ease-out'
              style={{ transform: `scaleX(${outOfStock ? 1 : soldRatio})` }}
            />
          </div>
        </div>

        <Button
          variant='primary'
          size='sm'
          className={cn(
            'mt-4 h-10 w-full transition-all duration-200 active:scale-[0.97]',
            added && 'bg-primary-hover'
          )}
          disabled={outOfStock}
          loading={adding}
          onClick={handleAdd}
          aria-label={added ? `Đã thêm ${product.name} vào giỏ hàng` : `Thêm ${product.name} vào giỏ hàng`}
        >
          {added ? (
            <>
              <Check className='h-4 w-4 animate-scale-in' aria-hidden />
              Đã thêm
            </>
          ) : (
            !adding && (
              <>
                <ShoppingCart className='h-4 w-4' aria-hidden />
                {outOfStock ? 'Tạm hết hàng' : 'Thêm vào giỏ'}
              </>
            )
          )}
        </Button>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className='overflow-hidden rounded-2xl border border-border/70 bg-card'>
      <div className={cn('aspect-square', shimmerClasses)} />
      <div className='space-y-2.5 p-4'>
        <div className={cn('h-3 w-1/3 rounded', shimmerClasses)} />
        <div className={cn('h-4 w-full rounded', shimmerClasses)} />
        <div className={cn('h-6 w-1/2 rounded', shimmerClasses)} />
        <div className={cn('mt-4 h-10 rounded-xl', shimmerClasses)} />
      </div>
    </div>
  );
}
