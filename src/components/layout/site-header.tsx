'use client';

import { useCart, useMe } from '@/api/shop';
import { useShopEntry } from '@/components/shop/use-shop-entry';
import { Button, buttonClasses } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { ShoppingCart, Store } from 'lucide-react';
import Link from 'next/link';
import { Logo } from './logo';
import { UserMenu } from './user-menu';

export function SiteHeader() {
  const { data: me, isLoading } = useMe();
  const { enterShop, dialog } = useShopEntry();
  const canShop = Boolean(me?.user && me.hasShopAccess);
  const { data: cart } = useCart(canShop);

  return (
    <header className='sticky top-0 z-40 border-border/70 border-b bg-background/85 backdrop-blur-md'>
      <div className='mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6'>
        <Logo />
        <nav className='flex items-center gap-1 sm:gap-2' aria-label='Điều hướng chính'>
          <Button variant='ghost' onClick={enterShop} className='px-3'>
            <Store className='h-5 w-5' aria-hidden />
            <span className='hidden sm:inline'>Cửa hàng</span>
          </Button>

          {canShop && (
            <Link
              href={ROUTES.CART}
              className={cn(buttonClasses('ghost', 'icon'), 'relative')}
              aria-label={`Giỏ hàng${cart?.count ? `, ${cart.count} sản phẩm` : ''}`}
            >
              <ShoppingCart className='h-5 w-5' aria-hidden />
              {Boolean(cart?.count) && (
                <span
                  key={cart!.count}
                  className='absolute top-1 right-0.5 flex h-5 min-w-5 animate-bump items-center justify-center rounded-full bg-accent px-1 font-bold text-[11px] text-white tabular-nums'
                >
                  {cart!.count > 99 ? '99+' : cart!.count}
                </span>
              )}
            </Link>
          )}

          {isLoading ? (
            <Skeleton className='h-10 w-28' />
          ) : me?.user ? (
            <UserMenu me={me} />
          ) : (
            <>
              <Link href={ROUTES.LOGIN} className={cn(buttonClasses('ghost'), 'px-3')}>
                Đăng nhập
              </Link>
              <Link href={ROUTES.REGISTER} className={cn(buttonClasses('primary'), 'hidden sm:inline-flex')}>
                Đăng ký
              </Link>
            </>
          )}
        </nav>
      </div>
      {dialog}
    </header>
  );
}
