'use client';

import { useMe } from '@/api/shop';
import { UserMenu } from '@/components/layout/user-menu';
import { useShopEntry } from '@/components/shop/use-shop-entry';
import { Skeleton } from '@/components/ui/skeleton';
import { BRAND } from '@/config/landing';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { Store } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { LionMascot } from './lion-mascot';
import { GRADIENT_BG, OUTLINE_BUTTON, PRIMARY_BUTTON } from './styles';
import { ThemeToggle } from './theme-toggle';

export function LandingNavbar() {
  const { data: me, isLoading } = useMe();
  const { enterShop, dialog } = useShopEntry();
  const [scrolled, setScrolled] = useState(false);
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const { scrollY, innerHeight } = window;
      const max = document.documentElement.scrollHeight - innerHeight;
      setScrolled(scrollY > 10);
      // Written straight to the DOM so scrolling does not re-render the navbar
      if (progressRef.current)
        progressRef.current.style.transform = `scaleX(${max > 0 ? Math.min(scrollY / max, 1) : 0})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b transition-[background-color,border-color,box-shadow] duration-300',
        scrolled
          ? 'border-slate-200/80 bg-white/80 shadow-lg shadow-slate-900/5 backdrop-blur-lg dark:border-slate-800/80 dark:bg-slate-950/80'
          : 'border-transparent bg-transparent'
      )}
    >
      <div className='mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between gap-3 px-4 sm:px-6'>
        <Link
          href={ROUTES.HOME}
          className='group flex min-w-0 items-center gap-2.5 rounded-2xl sm:gap-3'
          aria-label={`${BRAND.name} - Trang chủ`}
        >
          <span className='group-hover:-rotate-[8deg] flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 via-teal-50 to-amber-100 p-1.5 ring-1 ring-emerald-200 transition-transform duration-300 dark:from-emerald-500/20 dark:via-teal-500/10 dark:to-amber-500/20 dark:ring-emerald-500/30'>
            <LionMascot />
          </span>
          <span className='hidden flex-col leading-tight min-[420px]:flex'>
            <span className='whitespace-nowrap font-bold font-heading text-base text-slate-900 tracking-tight sm:text-lg dark:text-white'>
              {BRAND.name}
            </span>
            <span className='hidden text-slate-600 text-xs sm:block dark:text-slate-400'>{BRAND.tagline}</span>
          </span>
        </Link>

        <div className='flex shrink-0 items-center gap-2'>
          <ThemeToggle />
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
      </div>

      <span
        ref={progressRef}
        className={cn('absolute inset-x-0 bottom-0 h-0.5 origin-left', GRADIENT_BG)}
        style={{ transform: 'scaleX(0)' }}
        aria-hidden
      />
      {dialog}
    </header>
  );
}
