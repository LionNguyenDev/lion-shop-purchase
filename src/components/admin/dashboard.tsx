'use client';

import { useAdminStats, useShopSettings } from '@/api/admin';
import { buttonClasses } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatNumber } from '@/lib/format';
import { ORDER_STATUS_META } from '@/lib/order-status';
import { ROUTES } from '@/lib/routes';
import { ORDER_STATUSES } from '@/lib/validations';
import { AlertTriangle, EyeOff, Package, PackageX, Users, Wallet } from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from './page-header';

export function AdminDashboard() {
  const { data: stats, isLoading } = useAdminStats();
  const { data: settings } = useShopSettings();

  const cards = stats
    ? [
        {
          label: 'Doanh thu (đơn hoàn thành)',
          value: formatCurrency(stats.revenue),
          icon: Wallet,
          href: ROUTES.ADMIN_ORDERS,
        },
        { label: 'Người dùng', value: formatNumber(stats.users), icon: Users, href: ROUTES.ADMIN_USERS },
        { label: 'Sản phẩm', value: formatNumber(stats.products), icon: Package, href: ROUTES.ADMIN_PRODUCTS },
        { label: 'Đang ẩn', value: formatNumber(stats.hiddenProducts), icon: EyeOff, href: ROUTES.ADMIN_PRODUCTS },
        { label: 'Hết hàng', value: formatNumber(stats.outOfStock), icon: PackageX, href: ROUTES.ADMIN_PRODUCTS },
      ]
    : [];

  return (
    <div>
      <PageHeader title='Tổng quan' description='Tình hình cửa hàng của bạn' />

      {settings && !settings.hasShopPassword && (
        <div className='mb-6 flex flex-col gap-3 rounded-2xl border border-accent/40 bg-accent-soft p-4 sm:flex-row sm:items-center sm:justify-between'>
          <p className='flex items-center gap-2 font-medium text-accent-hover'>
            <AlertTriangle className='h-5 w-5 shrink-0' aria-hidden />
            Chưa đặt mật khẩu cửa hàng, khách hàng chưa thể vào mua sắm.
          </p>
          <Link href={ROUTES.ADMIN_SETTINGS} className={buttonClasses('accent', 'sm')}>
            Đặt mật khẩu
          </Link>
        </div>
      )}

      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-5'>
        {isLoading
          ? Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className='h-28' />)
          : cards.map(({ label, value, icon: Icon, href }) => (
              <Link key={label} href={href} className='rounded-2xl'>
                <Card className='h-full p-5 transition-colors duration-200 hover:border-primary'>
                  <div className='flex items-center justify-between'>
                    <p className='font-medium text-muted-foreground text-sm'>{label}</p>
                    <Icon className='h-5 w-5 text-primary' aria-hidden />
                  </div>
                  <p className='mt-3 font-bold font-heading text-2xl tabular-nums'>{value}</p>
                </Card>
              </Link>
            ))}
      </div>

      <h2 className='mt-10 mb-4 font-semibold text-lg'>Đơn hàng theo trạng thái</h2>
      <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5'>
        {ORDER_STATUSES.map((status) => (
          <Link key={status} href={`${ROUTES.ADMIN_ORDERS}?status=${status}`} className='rounded-2xl'>
            <Card className='p-5 transition-colors duration-200 hover:border-primary'>
              <p className='font-medium text-muted-foreground text-sm'>{ORDER_STATUS_META[status].label}</p>
              <p className='mt-2 font-bold font-heading text-2xl tabular-nums'>
                {isLoading ? '—' : formatNumber(stats?.orders[status] ?? 0)}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
