import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { ROUTES } from '@/lib/routes';
import { getCurrentUser } from '@/server/session';
import { hasShopAccess } from '@/server/shop-access';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

export default async function ShopLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect(`${ROUTES.LOGIN}?redirect=${encodeURIComponent(ROUTES.SHOP)}`);
  if (!(await hasShopAccess(user))) redirect(`${ROUTES.HOME}?shop=locked`);

  return (
    <div className='flex min-h-screen flex-col'>
      <SiteHeader />
      <main className='mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6'>{children}</main>
      <SiteFooter />
    </div>
  );
}
