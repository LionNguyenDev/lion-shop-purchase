import { BRAND } from '@/config/landing';
import { cn } from '@/lib/utils';
import { Hand } from 'lucide-react';
import { Suspense } from 'react';
import { HeroActions } from './hero-actions';
import { LionMascot } from './lion-mascot';
import { GRADIENT_TEXT } from './styles';

function PingDot({ className }: { className?: string }) {
  return (
    <span className={cn('relative flex h-2 w-2', className)} aria-hidden>
      <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75' />
      <span className='relative inline-flex h-2 w-2 rounded-full bg-emerald-500' />
    </span>
  );
}

export function HeroSection() {
  return (
    <section className='mx-auto grid max-w-6xl items-center gap-12 px-4 pt-10 pb-16 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:pt-16 lg:pb-24'>
      <div className='animate-fade-up-slow'>
        <p className='inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1.5 font-medium text-emerald-800 text-sm backdrop-blur dark:border-emerald-500/30 dark:bg-slate-900/70 dark:text-emerald-300'>
          <PingDot />
          {BRAND.tagline}
        </p>

        <h1 className='mt-6 font-bold text-4xl text-slate-900 leading-[1.15] tracking-tight sm:text-6xl dark:text-white'>
          <span className='flex items-center gap-3'>
            Xin chào!
            <Hand
              className='h-9 w-9 origin-[70%_80%] animate-wave text-amber-500 sm:h-14 sm:w-14 dark:text-amber-300'
              aria-hidden
            />
          </span>
          Chào mừng đến{' '}
          <span className='relative inline-block whitespace-nowrap'>
            <span className={cn('animate-gradient-shift bg-[length:200%_auto]', GRADIENT_TEXT)}>{BRAND.name}</span>
            <svg
              className='-bottom-2 sm:-bottom-3 absolute left-0 h-3 w-full sm:h-4'
              viewBox='0 0 200 12'
              preserveAspectRatio='none'
              aria-hidden
              focusable='false'
            >
              <defs>
                <linearGradient id='hero-underline' x1='0' x2='1' y1='0' y2='0'>
                  <stop offset='0%' stopColor='#059669' />
                  <stop offset='50%' stopColor='#14b8a6' />
                  <stop offset='100%' stopColor='#fbbf24' />
                </linearGradient>
              </defs>
              <path
                d='M3 9 C 40 3, 80 3, 120 6 S 180 10, 197 4'
                fill='none'
                stroke='url(#hero-underline)'
                strokeWidth='3.5'
                strokeLinecap='round'
                pathLength={1}
                strokeDasharray='1'
                className='animate-draw'
              />
            </svg>
          </span>
        </h1>

        <div className='mt-10'>
          <Suspense>
            <HeroActions />
          </Suspense>
        </div>
      </div>

      <HeroStage />
    </section>
  );
}

/** Decorative scene: glowing disc, two counter-rotating orbits and the floating mascot */
function HeroStage() {
  return (
    <div className='relative mx-auto aspect-square w-full max-w-[22rem] sm:max-w-md lg:max-w-[30rem]' aria-hidden>
      <div className='absolute inset-[8%] rounded-full bg-gradient-to-br from-emerald-200 via-teal-100 to-amber-200 opacity-80 blur-2xl dark:from-emerald-500/25 dark:via-teal-500/10 dark:to-amber-500/20' />

      <div className='absolute inset-[6%] animate-spin-slow rounded-full border-2 border-emerald-300/80 border-dashed dark:border-emerald-500/30'>
        <span className='-left-1.5 absolute top-1/2 h-3 w-3 rounded-full bg-emerald-500 shadow-emerald-500/50 shadow-lg' />
      </div>
      <div className='absolute inset-[19%] animate-spin-slow-reverse rounded-full border-2 border-amber-300/80 border-dashed dark:border-amber-500/30'>
        <span className='-top-1.5 absolute left-1/2 h-3 w-3 rounded-full bg-amber-400 shadow-amber-400/50 shadow-lg' />
      </div>

      <div className='absolute inset-[29%]'>
        <span className='absolute inset-0 animate-pulse-ring rounded-full bg-emerald-400/30' />
        <span className='absolute inset-0 animate-pulse-ring rounded-full bg-amber-300/30 [animation-delay:1.2s]' />
        <div className='relative h-full w-full animate-float-slow rounded-full bg-white/90 p-[10%] shadow-2xl shadow-emerald-500/25 ring-1 ring-slate-200 dark:bg-slate-900/90 dark:ring-slate-700'>
          <LionMascot />
        </div>
      </div>
    </div>
  );
}
