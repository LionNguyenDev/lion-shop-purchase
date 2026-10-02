'use client';

import type { Me } from '@/api/types';
import { authClient } from '@/lib/auth-client';
import { ROUTES } from '@/lib/routes';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useQueryClient } from '@tanstack/react-query';
import { ChevronDown, LayoutDashboard, LogOut, Package, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const itemClasses =
  'flex h-11 cursor-pointer items-center gap-3 rounded-lg px-3 text-sm font-medium outline-none transition-colors data-[highlighted]:bg-muted';

export function UserMenu({ me }: { me: Me }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = me.user!;

  const signOut = async () => {
    await authClient.signOut();
    queryClient.clear();
    router.push(ROUTES.HOME);
    router.refresh();
  };

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger className='flex h-11 items-center gap-2 rounded-xl px-2 transition-colors hover:bg-muted'>
        <span className='flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft font-bold text-primary text-sm'>
          {user.name.charAt(0).toUpperCase()}
        </span>
        <span className='hidden max-w-32 truncate font-semibold text-sm md:block'>{user.name}</span>
        <ChevronDown className='h-4 w-4 text-muted-foreground' aria-hidden />
        <span className='sr-only'>Mở menu tài khoản</span>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align='end'
          sideOffset={8}
          className='z-50 w-64 rounded-xl border border-border bg-card p-1.5 shadow-lift'
        >
          <div className='px-3 py-2'>
            <p className='truncate font-semibold text-sm'>{user.name}</p>
            <p className='truncate text-muted-foreground text-xs'>{user.email}</p>
          </div>
          <DropdownMenu.Separator className='my-1 h-px bg-border' />
          {me.hasShopAccess && (
            <DropdownMenu.Item asChild className={itemClasses}>
              <Link href={ROUTES.MY_ORDERS}>
                <Package className='h-4 w-4' aria-hidden />
                Đơn hàng của tôi
              </Link>
            </DropdownMenu.Item>
          )}
          {user.role === 'admin' && (
            <DropdownMenu.Item asChild className={itemClasses}>
              <Link href={ROUTES.ADMIN}>
                <LayoutDashboard className='h-4 w-4' aria-hidden />
                Trang quản trị
              </Link>
            </DropdownMenu.Item>
          )}
          {!me.hasShopAccess && user.role !== 'admin' && (
            <div className='flex items-center gap-3 px-3 py-2 text-muted-foreground text-xs'>
              <User className='h-4 w-4' aria-hidden />
              Bạn chưa mở khoá cửa hàng
            </div>
          )}
          <DropdownMenu.Separator className='my-1 h-px bg-border' />
          <DropdownMenu.Item onSelect={signOut} className={`${itemClasses} text-destructive`}>
            <LogOut className='h-4 w-4' aria-hidden />
            Đăng xuất
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
