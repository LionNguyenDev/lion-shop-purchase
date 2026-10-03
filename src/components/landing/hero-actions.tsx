'use client';

import { useMe } from '@/api/shop';
import { useShopEntry } from '@/components/shop/use-shop-entry';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { OUTLINE_BUTTON, PRIMARY_BUTTON } from './styles';

export function HeroActions() {
  const { data: me } = useMe();
  const { enterShop, openDialog, dialog } = useShopEntry();
  const searchParams = useSearchParams();
  const router = useRouter();

  // The shop layout redirects here with ?shop=locked when the user has not entered the password yet
  useEffect(() => {
    if (searchParams.get('shop') === 'locked' && me?.user && !me.hasShopAccess) {
      openDialog();
      router.replace(ROUTES.HOME, { scroll: false });
    }
  }, [searchParams, me, openDialog, router]);

  return (
    <div className='flex flex-col gap-3 sm:flex-row'>
      <button type='button' onClick={enterShop} className={cn(PRIMARY_BUTTON, 'group h-12 px-6 text-base')}>
        Khám phá ngay
        <ArrowRight className='h-5 w-5 transition-transform duration-200 group-hover:translate-x-1' aria-hidden />
      </button>
      <a href='#contact' className={cn(OUTLINE_BUTTON, 'h-12 px-6 text-base')}>
        <MessageCircle className='h-5 w-5' aria-hidden />
        Liên hệ mua hàng
      </a>
      {dialog}
    </div>
  );
}
