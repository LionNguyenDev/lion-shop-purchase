import { LionMascot } from '@/components/landing/lion-mascot';
import { BRAND } from '@/config/landing';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  href?: string;
  /** Extra classes for the name + tagline block, e.g. to hide it on narrow screens */
  textClassName?: string;
}

/** Mascot in a soft gradient tile, name and tagline. Shared by the landing page, shop, auth and admin */
export function Logo({ className, href = ROUTES.HOME, textClassName }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn('group inline-flex min-w-0 items-center gap-2.5 rounded-2xl sm:gap-3', className)}
      aria-label={`${BRAND.name} - Trang chủ`}
    >
      <span className='group-hover:-rotate-[8deg] flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 via-teal-50 to-amber-100 p-1.5 ring-1 ring-emerald-200 transition-transform duration-300 dark:from-emerald-500/20 dark:via-teal-500/10 dark:to-amber-500/20 dark:ring-emerald-500/30'>
        <LionMascot />
      </span>
      <span className={cn('flex flex-col leading-tight', textClassName)}>
        <span className='whitespace-nowrap font-bold font-heading text-base text-foreground tracking-tight sm:text-lg'>
          {BRAND.name}
        </span>
        <span className='hidden text-muted-foreground text-xs sm:block'>{BRAND.tagline}</span>
      </span>
    </Link>
  );
}
