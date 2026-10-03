import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

const SIZES = {
  sm: { frame: 'rounded-[1.75rem] border-[6px]', screen: 'rounded-[1.3rem]', notch: 'h-3.5 w-16 rounded-b-xl' },
  lg: { frame: 'rounded-[2.75rem] border-[10px]', screen: 'rounded-[2rem]', notch: 'h-6 w-28 rounded-b-2xl' },
} as const;

interface PhoneMockupProps {
  children: ReactNode;
  size?: keyof typeof SIZES;
  className?: string;
}

/** Decorative phone frame with a notch; content inside is a fake screen */
export function PhoneMockup({ children, size = 'lg', className }: PhoneMockupProps) {
  const styles = SIZES[size];
  return (
    <div
      className={cn(
        'relative mx-auto border-slate-900 bg-slate-900 shadow-2xl shadow-slate-900/20 dark:border-slate-700 dark:bg-slate-700',
        styles.frame,
        className
      )}
      aria-hidden
    >
      <span
        className={cn('-translate-x-1/2 absolute top-0 left-1/2 z-10 bg-slate-900 dark:bg-slate-700', styles.notch)}
      />
      <div className={cn('relative h-full overflow-hidden bg-white dark:bg-slate-900', styles.screen)}>{children}</div>
    </div>
  );
}
