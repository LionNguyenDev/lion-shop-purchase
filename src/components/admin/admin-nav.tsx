'use client';

import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { FolderTree, LayoutDashboard, Package, Receipt, Settings, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: ROUTES.ADMIN, label: 'Tổng quan', icon: LayoutDashboard },
  { href: ROUTES.ADMIN_ORDERS, label: 'Đơn hàng', icon: Receipt },
  { href: ROUTES.ADMIN_PRODUCTS, label: 'Sản phẩm', icon: Package },
  { href: ROUTES.ADMIN_CATEGORIES, label: 'Danh mục', icon: FolderTree },
  { href: ROUTES.ADMIN_USERS, label: 'Người dùng', icon: Users },
  { href: ROUTES.ADMIN_SETTINGS, label: 'Cài đặt', icon: Settings },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label='Quản trị' className='flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-3 lg:pt-2'>
      {LINKS.map(({ href, label, icon: Icon }) => {
        const active = href === ROUTES.ADMIN ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex h-11 shrink-0 items-center gap-3 whitespace-nowrap rounded-xl px-3 font-semibold text-sm transition-colors duration-200',
              active
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <Icon className='h-5 w-5' aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
