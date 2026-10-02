'use client';

import { useMe } from '@/api/shop';
import { ROUTES } from '@/lib/routes';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ShopAccessDialog } from './shop-access-dialog';

/**
 * Entry point to the shop: guests go to login, unlocked users go straight in,
 * everyone else gets the shop password dialog.
 */
export function useShopEntry() {
  const router = useRouter();
  const { data: me } = useMe();
  const [open, setOpen] = useState(false);

  const enterShop = () => {
    if (!me?.user) router.push(`${ROUTES.LOGIN}?redirect=${encodeURIComponent(ROUTES.SHOP)}`);
    else if (me.hasShopAccess) router.push(ROUTES.SHOP);
    else setOpen(true);
  };

  const dialog = <ShopAccessDialog open={open} onOpenChange={setOpen} />;
  return { enterShop, openDialog: () => setOpen(true), dialog };
}
