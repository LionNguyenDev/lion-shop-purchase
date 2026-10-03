import { SiteShell } from '@/components/layout/site-shell';
import { ComeBackBanner } from '@/components/shop/come-back-banner';
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
    <SiteShell>
      <main className='mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6'>
        <ComeBackBanner />
        {children}
      </main>
    </SiteShell>
  );
}
