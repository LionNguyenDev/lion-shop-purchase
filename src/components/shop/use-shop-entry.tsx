'use client';

import { useMe } from '@/api/shop';
import { ROUTES } from '@/lib/routes';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LoginRequiredDialog } from './login-required-dialog';
import { ShopAccessDialog } from './shop-access-dialog';

/**
 * Entry point to the shop: guests are told to log in (and that a shop password follows),
 * unlocked users go straight in, everyone else gets the shop password dialog.
 */
export function useShopEntry() {
  const router = useRouter();
  const { data: me } = useMe();
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const enterShop = () => {
    if (!me?.user) setLoginOpen(true);
    else if (me.hasShopAccess) router.push(ROUTES.SHOP);
    else setOpen(true);
  };

  const dialog = (
    <>
      <ShopAccessDialog open={open} onOpenChange={setOpen} />
      <LoginRequiredDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
  return { enterShop, openDialog: () => setOpen(true), dialog };
}
