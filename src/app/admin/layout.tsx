import { AdminNav } from '@/components/admin/admin-nav';
import { Logo } from '@/components/layout/logo';
import { ROUTES } from '@/lib/routes';
import { getCurrentUser, isAdmin } from '@/server/session';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

export const metadata: Metadata = { title: { default: 'Quản trị', template: '%s | Quản trị Lion Cosmetic' } };

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect(`${ROUTES.LOGIN}?redirect=${encodeURIComponent(ROUTES.ADMIN)}`);
  if (!isAdmin(user)) redirect(ROUTES.HOME);

  return (
    <div className='min-h-screen lg:grid lg:grid-cols-[248px_1fr]'>
      <aside className='border-border/70 border-b bg-card lg:sticky lg:top-0 lg:h-screen lg:border-r lg:border-b-0'>
        <div className='flex h-16 items-center justify-between px-4 lg:px-5'>
          <Logo href={ROUTES.ADMIN} />
          <Link
            href={ROUTES.HOME}
            className='flex h-11 items-center gap-1 rounded-xl px-2 font-semibold text-muted-foreground text-sm hover:text-primary lg:hidden'
          >
            <ArrowLeft className='h-4 w-4' aria-hidden />
            Trang chủ
          </Link>
        </div>
        <AdminNav />
        <div className='absolute bottom-0 hidden w-[248px] border-border/70 border-t p-4 lg:block'>
          <p className='truncate font-semibold text-sm'>{user.name}</p>
          <p className='truncate text-muted-foreground text-xs'>{user.email}</p>
          <Link
            href={ROUTES.HOME}
            className='mt-3 inline-flex min-h-9 items-center gap-1 font-semibold text-primary text-sm hover:underline'
          >
            <ArrowLeft className='h-4 w-4' aria-hidden />
            Về trang chủ
          </Link>
        </div>
      </aside>
      <main className='min-w-0 px-4 py-6 sm:px-6 lg:px-8 lg:py-8'>{children}</main>
    </div>
  );
}
