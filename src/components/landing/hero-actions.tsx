'use client';

import { useMe } from '@/api/shop';
import { useShopEntry } from '@/components/shop/use-shop-entry';
import { Button, buttonClasses } from '@/components/ui/button';
import { ROUTES } from '@/lib/routes';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

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
      <Button variant='accent' size='lg' onClick={enterShop} className='group'>
        Vào cửa hàng
        <ArrowRight className='h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5' aria-hidden />
      </Button>
      {!me?.user && (
        <Link href={ROUTES.REGISTER} className={buttonClasses('outline', 'lg')}>
          Tạo tài khoản miễn phí
        </Link>
      )}
      {dialog}
    </div>
  );
}
