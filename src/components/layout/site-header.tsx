'use client';

import { useCart, useMe } from '@/api/shop';
import { OUTLINE_BUTTON, PRIMARY_BUTTON } from '@/components/landing/styles';
import { ThemeToggle } from '@/components/landing/theme-toggle';
import { useShopEntry } from '@/components/shop/use-shop-entry';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { ShoppingCart, Store } from 'lucide-react';
import Link from 'next/link';
import { Logo } from './logo';
import { StickyHeader } from './sticky-header';
import { UserMenu } from './user-menu';

/** Header for the landing page and the shop */
export function SiteHeader() {
  const { data: me, isLoading } = useMe();
  const { enterShop, dialog } = useShopEntry();
  const canShop = Boolean(me?.user && me.hasShopAccess);
  const { data: cart } = useCart(canShop);

  return (
    <StickyHeader>
      <Logo textClassName='hidden min-[420px]:flex' />

      <div className='flex shrink-0 items-center gap-2'>
        <ThemeToggle />

        {canShop && (
          <Link
            href={ROUTES.CART}
            className='hover:-translate-y-0.5 relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white/70 text-slate-700 transition-[transform,color] duration-200 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:text-emerald-300'
            aria-label={`Giỏ hàng${cart?.count ? `, ${cart.count} sản phẩm` : ''}`}
          >
            <ShoppingCart className='h-5 w-5' aria-hidden />
            {Boolean(cart?.count) && (
              <span
                key={cart!.count}
                className='-top-1.5 -right-1.5 absolute flex h-5 min-w-5 animate-bump items-center justify-center rounded-full border-2 border-white bg-rose-600 px-1 font-bold text-[11px] text-white tabular-nums dark:border-slate-950'
              >
                {cart!.count > 99 ? '99+' : cart!.count}
              </span>
            )}
          </Link>
        )}

        <button
          type='button'
          onClick={enterShop}
          className={cn(PRIMARY_BUTTON, 'h-11 w-11 whitespace-nowrap text-sm sm:w-auto sm:px-5')}
          aria-label='Vào cửa hàng'
        >
          <Store className='h-5 w-5 shrink-0' aria-hidden />
          <span className='hidden sm:inline'>Vào cửa hàng</span>
        </button>

        {isLoading ? (
          <Skeleton className='h-11 w-28 rounded-2xl' />
        ) : me?.user ? (
          <UserMenu me={me} />
        ) : (
          <Link href={ROUTES.LOGIN} className={cn(OUTLINE_BUTTON, 'h-11 whitespace-nowrap px-4 text-sm sm:px-5')}>
            Đăng nhập
          </Link>
        )}
      </div>
      {dialog}
    </StickyHeader>
  );
}
