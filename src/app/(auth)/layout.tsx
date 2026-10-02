import { Logo } from '@/components/layout/logo';
import { getCurrentUser } from '@/server/session';
import { CheckCircle2 } from 'lucide-react';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

const POINTS = ['Đặt hàng nhanh trong vài bước', 'Giao hàng tận nơi toàn quốc', 'Thanh toán khi nhận hàng'];

export default async function AuthLayout({ children }: { children: ReactNode }) {
  if (await getCurrentUser()) redirect('/');

  return (
    <div className='grid min-h-screen lg:grid-cols-2'>
      <aside className='relative hidden overflow-hidden bg-primary p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between'>
        <Logo className='[&_span:last-child]:text-white' />
        <div>
          <h2 className='font-bold text-4xl leading-tight'>Mua sắm thông minh cùng Lion Shopping</h2>
          <ul className='mt-8 space-y-4'>
            {POINTS.map((point) => (
              <li key={point} className='flex items-center gap-3 text-lg'>
                <CheckCircle2 className='h-6 w-6 text-accent-soft' aria-hidden />
                {point}
              </li>
            ))}
          </ul>
        </div>
        <div className='-right-24 -bottom-24 absolute h-80 w-80 rounded-full bg-accent/90' aria-hidden />
        <div className='-bottom-10 absolute right-40 h-32 w-32 rounded-3xl bg-primary-hover' aria-hidden />
      </aside>
      <main className='flex flex-col px-4 py-8 sm:px-6'>
        <Logo className='lg:hidden' />
        <div className='mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-8'>{children}</div>
      </main>
    </div>
  );
}
