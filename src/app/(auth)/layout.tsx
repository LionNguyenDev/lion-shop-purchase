import { LionMascot } from '@/components/landing/lion-mascot';
import { OUTLINE_BUTTON } from '@/components/landing/styles';
import { Logo } from '@/components/layout/logo';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { getCurrentUser } from '@/server/session';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

/** Purely decorative brand panel: floating mascot between two counter-rotating orbits */
function MascotPanel() {
  return (
    <aside
      className='relative isolate hidden overflow-hidden bg-gradient-to-br from-emerald-700 via-teal-700 to-teal-800 lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center lg:justify-center'
      aria-hidden
    >
      <div className='-right-24 -bottom-24 -z-10 absolute h-96 w-96 rounded-full bg-amber-300/40 blur-3xl' />
      <div className='-top-24 -left-16 -z-10 absolute h-80 w-80 rounded-full bg-emerald-300/30 blur-3xl' />

      <div className='relative aspect-square w-[min(80%,30rem)]'>
        <div className='absolute inset-0 animate-spin-slow rounded-full border-2 border-white/25 border-dashed'>
          <span className='-left-1.5 absolute top-1/2 h-3 w-3 rounded-full bg-amber-300 shadow-amber-300/60 shadow-lg' />
        </div>
        <div className='absolute inset-[14%] animate-spin-slow-reverse rounded-full border-2 border-white/20 border-dashed'>
          <span className='-top-1.5 absolute left-1/2 h-3 w-3 rounded-full bg-emerald-200 shadow-emerald-200/60 shadow-lg' />
        </div>
        <div className='absolute inset-[27%]'>
          <span className='absolute inset-0 animate-pulse-ring rounded-full bg-white/25' />
          <span className='absolute inset-0 animate-pulse-ring rounded-full bg-amber-200/25 [animation-delay:1.2s]' />
          <div className='relative h-full w-full animate-float-slow rounded-full bg-white/95 p-[10%] shadow-2xl shadow-teal-950/40 ring-8 ring-white/20'>
            <LionMascot />
          </div>
        </div>
      </div>
    </aside>
  );
}

export default async function AuthLayout({ children }: { children: ReactNode }) {
  if (await getCurrentUser()) redirect('/');

  return (
    <div className='grid min-h-screen bg-white lg:grid-cols-2'>
      <MascotPanel />
      <main className='flex flex-col px-4 py-6 sm:px-6'>
        <div className='flex items-center justify-between gap-3'>
          <Logo textClassName='hidden min-[360px]:flex' />
          <Link href={ROUTES.HOME} className={cn(OUTLINE_BUTTON, 'h-11 shrink-0 px-4 text-sm')}>
            <ArrowLeft className='h-4 w-4' aria-hidden />
            Trang chủ
          </Link>
        </div>
        <div className='mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-8'>{children}</div>
      </main>
    </div>
  );
}
